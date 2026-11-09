package com.optimization.scheduler.engine;

import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class QLearningOptimizer {

    @Autowired
    private SuitabilityCalculator suitabilityCalculator;

    private static final double ALPHA = 0.15; // Learning Rate
    private static final double GAMMA = 0.90; // Discount Factor
    private static final double EPSILON = 0.20; // Exploration Rate
    private static final int TRAINING_EPISODES = 150;

    // Persisted Q-Table: State -> (Action -> QValue)
    private final Map<String, Map<Integer, Double>> qTable = new ConcurrentHashMap<>();

    public HeuristicOptimizer.OptimizationResult optimize(List<Task> tasks, List<Developer> developers) {
        long startTime = System.currentTimeMillis();
        HeuristicOptimizer.OptimizationResult result = new HeuristicOptimizer.OptimizationResult();
        result.algorithmName = "Reinforcement Learning (Q-Learning Adaptive Agent)";

        if (tasks.isEmpty() || developers.isEmpty()) {
            return result;
        }

        Random rand = new Random(123);

        // Train Q-Learning Agent across Episodes
        for (int episode = 0; episode < TRAINING_EPISODES; episode++) {
            Map<Long, Integer> devAvailableDay = new HashMap<>();
            Map<Long, Double> devWorkload = new HashMap<>();
            for (Developer d : developers) {
                devAvailableDay.put(d.getId(), 0);
                devWorkload.put(d.getId(), d.getCurrentWorkload());
            }

            Map<Long, Integer> taskFinish = new HashMap<>();

            for (Task task : tasks) {
                int earliestStart = 0;
                for (Long depId : task.getDependencyTaskIds()) {
                    if (taskFinish.containsKey(depId)) {
                        earliestStart = Math.max(earliestStart, taskFinish.get(depId));
                    }
                }

                // For each developer option, build state
                for (int actionDevIdx = 0; actionDevIdx < developers.size(); actionDevIdx++) {
                    Developer dev = developers.get(actionDevIdx);
                    String stateKey = buildStateKey(task, dev);

                    qTable.putIfAbsent(stateKey, new HashMap<>());
                    Map<Integer, Double> actionQValues = qTable.get(stateKey);
                    actionQValues.putIfAbsent(actionDevIdx, 10.0); // initial default Q-value

                    // Choose action: Epsilon-Greedy
                    int chosenAction = actionDevIdx;
                    if (rand.nextDouble() < EPSILON) {
                        chosenAction = rand.nextInt(developers.size());
                    }

                    Developer chosenDev = developers.get(chosenAction);
                    int start = Math.max(earliestStart, devAvailableDay.get(chosenDev.getId()));
                    int finish = start + task.getEstimatedDurationDays();
                    double suitability = suitabilityCalculator.calculateSuitability(chosenDev, task);

                    // Compute Reward
                    double reward = calculateReward(suitability, finish, task.getEstimatedDurationDays() * 2, devWorkload.get(chosenDev.getId()));

                    // Q-Update Formula: Q(s,a) = Q(s,a) + alpha * [Reward + gamma * max_a'(Q(s',a')) - Q(s,a)]
                    double currentQ = actionQValues.getOrDefault(chosenAction, 0.0);
                    double maxNextQ = actionQValues.values().stream().mapToDouble(Double::doubleValue).max().orElse(0.0);
                    double newQ = currentQ + ALPHA * (reward + GAMMA * maxNextQ - currentQ);

                    actionQValues.put(chosenAction, newQ);
                }
            }
        }

        // Policy Execution Phase using Learned Q-Table
        Map<Long, Integer> devAvailableDay = new HashMap<>();
        Map<Long, Double> devWorkload = new HashMap<>();
        for (Developer d : developers) {
            devAvailableDay.put(d.getId(), 0);
            devWorkload.put(d.getId(), d.getCurrentWorkload());
        }

        Map<Long, Integer> taskFinish = new HashMap<>();
        double totalCostSum = 0;
        double totalSuitabilitySum = 0;

        for (Task task : tasks) {
            int earliestStart = 0;
            for (Long depId : task.getDependencyTaskIds()) {
                if (taskFinish.containsKey(depId)) {
                    earliestStart = Math.max(earliestStart, taskFinish.get(depId));
                }
            }

            int bestActionIdx = 0;
            double bestQ = -Double.MAX_VALUE;

            for (int devIdx = 0; devIdx < developers.size(); devIdx++) {
                Developer dev = developers.get(devIdx);
                String stateKey = buildStateKey(task, dev);
                double qVal = qTable.getOrDefault(stateKey, Collections.emptyMap()).getOrDefault(devIdx, 0.0);

                if (qVal > bestQ) {
                    bestQ = qVal;
                    bestActionIdx = devIdx;
                }
            }

            Developer assignedDev = developers.get(bestActionIdx);
            int start = Math.max(earliestStart, devAvailableDay.get(assignedDev.getId()));
            int finish = start + task.getEstimatedDurationDays();
            devAvailableDay.put(assignedDev.getId(), finish);
            taskFinish.put(task.getId(), finish);

            double suitability = suitabilityCalculator.calculateSuitability(assignedDev, task);
            totalSuitabilitySum += suitability;
            double cost = task.getEstimatedDurationDays() * 8.0 * assignedDev.getHourlyRate();
            totalCostSum += cost;

            devWorkload.put(assignedDev.getId(), devWorkload.get(assignedDev.getId()) + task.getEstimatedDurationDays() * 8);

            HeuristicOptimizer.TaskAssignment assignment = new HeuristicOptimizer.TaskAssignment();
            assignment.taskId = task.getId();
            assignment.taskName = task.getName();
            assignment.developerId = assignedDev.getId();
            assignment.developerName = assignedDev.getName();
            assignment.startDay = start;
            assignment.endDay = finish;
            assignment.suitabilityScore = Math.round(suitability * 100.0) / 100.0;
            assignment.priority = task.getPriority();

            result.assignments.add(assignment);
        }

        result.totalMakespanDays = devAvailableDay.values().stream().max(Integer::compareTo).orElse(0);
        result.totalCost = Math.round(totalCostSum * 100.0) / 100.0;
        result.averageSuitability = Math.round((totalSuitabilitySum / tasks.size()) * 100.0) / 100.0;
        result.workloadVariance = calculateVariance(devWorkload.values());
        result.executionTimeMs = System.currentTimeMillis() - startTime;

        return result;
    }

    private String buildStateKey(Task task, Developer dev) {
        String cTier = task.getComplexity() > 7 ? "HIGH_COMPLEX" : (task.getComplexity() > 4 ? "MED_COMPLEX" : "LOW_COMPLEX");
        String wTier = dev.getCurrentWorkload() > 70 ? "HIGH_LOAD" : (dev.getCurrentWorkload() > 40 ? "MED_LOAD" : "LOW_LOAD");
        return cTier + "_" + wTier + "_" + task.getPriority();
    }

    private double calculateReward(double suitability, int finishDay, int targetDeadline, double currentWorkload) {
        double reward = 0;
        if (suitability >= 80) reward += 80;
        else if (suitability >= 50) reward += 40;
        else reward -= 50; // penalty for low skill match

        if (finishDay <= targetDeadline) reward += 50;
        else reward -= (finishDay - targetDeadline) * 10; // penalty for delay

        if (currentWorkload > 85) reward -= 60; // penalty for overload
        else reward += 20;

        return reward;
    }

    private double calculateVariance(Collection<Double> values) {
        if (values.isEmpty()) return 0.0;
        double mean = values.stream().mapToDouble(Double::doubleValue).average().orElse(0.0);
        double temp = 0;
        for (double a : values) {
            temp += (a - mean) * (a - mean);
        }
        return Math.round((temp / values.size()) * 100.0) / 100.0;
    }
}
