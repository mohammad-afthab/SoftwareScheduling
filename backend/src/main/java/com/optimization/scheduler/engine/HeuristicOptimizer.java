package com.optimization.scheduler.engine;

import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class HeuristicOptimizer {

    @Autowired
    private SuitabilityCalculator suitabilityCalculator;

    public static class OptimizationResult {
        public String algorithmName = "Heuristic (Priority + EDF + Skill Match)";
        public List<TaskAssignment> assignments = new ArrayList<>();
        public int totalMakespanDays;
        public double totalCost;
        public double workloadVariance;
        public double averageSuitability;
        public long executionTimeMs;
    }

    public static class TaskAssignment {
        public Long taskId;
        public String taskName;
        public Long developerId;
        public String developerName;
        public int startDay;
        public int endDay;
        public double suitabilityScore;
        public Task.TaskPriority priority;
    }

    public OptimizationResult optimize(List<Task> tasks, List<Developer> developers) {
        long startTime = System.currentTimeMillis();
        OptimizationResult result = new OptimizationResult();

        if (tasks.isEmpty() || developers.isEmpty()) {
            return result;
        }

        // Sort tasks by Priority (CRITICAL > VERY_HIGH > HIGH > MEDIUM > LOW) & Earliest Deadline
        List<Task> sortedTasks = new ArrayList<>(tasks);
        sortedTasks.sort((t1, t2) -> {
            int pCompare = Integer.compare(getPriorityRank(t2.getPriority()), getPriorityRank(t1.getPriority()));
            if (pCompare != 0) return pCompare;
            return Integer.compare(t1.getComplexity(), t2.getComplexity());
        });

        Map<Long, Integer> devNextAvailableDay = new HashMap<>();
        Map<Long, Double> devTotalWorkloadHours = new HashMap<>();
        for (Developer d : developers) {
            devNextAvailableDay.put(d.getId(), 0);
            devTotalWorkloadHours.put(d.getId(), d.getCurrentWorkload());
        }

        Map<Long, Integer> taskCompletionDays = new HashMap<>();
        double totalCostSum = 0;
        double totalSuitabilitySum = 0;

        for (Task task : sortedTasks) {
            // Find earliest start day based on dependencies
            int earliestStartDay = 0;
            for (Long depId : task.getDependencyTaskIds()) {
                if (taskCompletionDays.containsKey(depId)) {
                    earliestStartDay = Math.max(earliestStartDay, taskCompletionDays.get(depId));
                }
            }

            // Find best developer (Highest suitability score & lowest available day)
            Developer bestDev = null;
            double bestScore = -1.0;
            int bestStartDay = Integer.MAX_VALUE;

            for (Developer dev : developers) {
                double score = suitabilityCalculator.calculateSuitability(dev, task);
                int devAvailDay = devNextAvailableDay.get(dev.getId());
                int actualStartDay = Math.max(earliestStartDay, devAvailDay);

                if (score > bestScore || (Math.abs(score - bestScore) < 0.001 && actualStartDay < bestStartDay)) {
                    bestScore = score;
                    bestDev = dev;
                    bestStartDay = actualStartDay;
                }
            }

            if (bestDev == null) {
                bestDev = developers.get(0);
                bestScore = suitabilityCalculator.calculateSuitability(bestDev, task);
                bestStartDay = earliestStartDay;
            }

            int finishDay = bestStartDay + task.getEstimatedDurationDays();
            devNextAvailableDay.put(bestDev.getId(), finishDay);
            taskCompletionDays.put(task.getId(), finishDay);

            double taskCost = task.getEstimatedDurationDays() * 8.0 * bestDev.getHourlyRate();
            totalCostSum += taskCost;
            totalSuitabilitySum += bestScore;

            devTotalWorkloadHours.put(bestDev.getId(), devTotalWorkloadHours.get(bestDev.getId()) + task.getEstimatedDurationDays() * 8);

            TaskAssignment assignment = new TaskAssignment();
            assignment.taskId = task.getId();
            assignment.taskName = task.getName();
            assignment.developerId = bestDev.getId();
            assignment.developerName = bestDev.getName();
            assignment.startDay = bestStartDay;
            assignment.endDay = finishDay;
            assignment.suitabilityScore = Math.round(bestScore * 100.0) / 100.0;
            assignment.priority = task.getPriority();

            result.assignments.add(assignment);
        }

        result.totalMakespanDays = devNextAvailableDay.values().stream().max(Integer::compareTo).orElse(0);
        result.totalCost = Math.round(totalCostSum * 100.0) / 100.0;
        result.averageSuitability = Math.round((totalSuitabilitySum / tasks.size()) * 100.0) / 100.0;
        result.workloadVariance = calculateVariance(devTotalWorkloadHours.values());
        result.executionTimeMs = System.currentTimeMillis() - startTime;

        return result;
    }

    private int getPriorityRank(Task.TaskPriority priority) {
        if (priority == null) return 1;
        return switch (priority) {
            case CRITICAL -> 5;
            case VERY_HIGH -> 4;
            case HIGH -> 3;
            case MEDIUM -> 2;
            case LOW -> 1;
        };
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
