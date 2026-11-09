package com.optimization.scheduler.engine;

import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Task;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
public class GeneticAlgorithmOptimizer {

    @Autowired
    private SuitabilityCalculator suitabilityCalculator;

    private static final int POPULATION_SIZE = 60;
    private static final int MAX_GENERATIONS = 120;
    private static final double CROSSOVER_RATE = 0.85;
    private static final double MUTATION_RATE = 0.15;

    public HeuristicOptimizer.OptimizationResult optimize(List<Task> tasks, List<Developer> developers) {
        long startTime = System.currentTimeMillis();
        HeuristicOptimizer.OptimizationResult result = new HeuristicOptimizer.OptimizationResult();
        result.algorithmName = "Metaheuristic (Genetic Algorithm - Multi-Objective GA)";

        if (tasks.isEmpty() || developers.isEmpty()) {
            return result;
        }

        int numTasks = tasks.size();
        int numDevs = developers.size();
        Random rand = new Random(42);

        // Initialize Population
        List<int[]> population = new ArrayList<>();
        for (int i = 0; i < POPULATION_SIZE; i++) {
            int[] chromosome = new int[numTasks];
            for (int t = 0; t < numTasks; t++) {
                chromosome[t] = rand.nextInt(numDevs);
            }
            population.add(chromosome);
        }

        int[] bestChromosome = population.get(0);
        double bestFitness = -1.0;

        // GA Evolution Loop
        for (int gen = 0; gen < MAX_GENERATIONS; gen++) {
            List<Double> fitnesses = new ArrayList<>();
            for (int[] chromo : population) {
                double fit = evaluateFitness(chromo, tasks, developers);
                fitnesses.add(fit);
                if (fit > bestFitness) {
                    bestFitness = fit;
                    bestChromosome = chromo.clone();
                }
            }

            // Selection & Next Gen Creation
            List<int[]> nextGen = new ArrayList<>();
            // Elitism: retain best
            nextGen.add(bestChromosome.clone());

            while (nextGen.size() < POPULATION_SIZE) {
                int[] p1 = tournamentSelect(population, fitnesses, rand);
                int[] p2 = tournamentSelect(population, fitnesses, rand);

                int[] child1 = p1.clone();
                int[] child2 = p2.clone();

                if (rand.nextDouble() < CROSSOVER_RATE) {
                    int crossPoint = 1 + rand.nextInt(Math.max(1, numTasks - 1));
                    for (int k = crossPoint; k < numTasks; k++) {
                        child1[k] = p2[k];
                        child2[k] = p1[k];
                    }
                }

                mutate(child1, numDevs, rand);
                mutate(child2, numDevs, rand);

                nextGen.add(child1);
                if (nextGen.size() < POPULATION_SIZE) {
                    nextGen.add(child2);
                }
            }
            population = nextGen;
        }

        // Build Result from bestChromosome
        return decodeChromosome(bestChromosome, tasks, developers, startTime, result);
    }

    private double evaluateFitness(int[] chromosome, List<Task> tasks, List<Developer> developers) {
        Map<Long, Integer> devAvailableDay = new HashMap<>();
        Map<Long, Double> devWorkload = new HashMap<>();
        for (Developer d : developers) {
            devAvailableDay.put(d.getId(), 0);
            devWorkload.put(d.getId(), d.getCurrentWorkload());
        }

        Map<Long, Integer> taskFinish = new HashMap<>();
        double suitabilitySum = 0;
        int dependencyViolations = 0;

        for (int i = 0; i < tasks.size(); i++) {
            Task task = tasks.get(i);
            Developer dev = developers.get(chromosome[i]);

            int earliestStart = 0;
            for (Long depId : task.getDependencyTaskIds()) {
                if (taskFinish.containsKey(depId)) {
                    earliestStart = Math.max(earliestStart, taskFinish.get(depId));
                }
            }

            int start = Math.max(earliestStart, devAvailableDay.get(dev.getId()));
            int finish = start + task.getEstimatedDurationDays();
            devAvailableDay.put(dev.getId(), finish);
            taskFinish.put(task.getId(), finish);

            double suitability = suitabilityCalculator.calculateSuitability(dev, task);
            suitabilitySum += suitability;

            devWorkload.put(dev.getId(), devWorkload.get(dev.getId()) + task.getEstimatedDurationDays() * 8);
        }

        int makespan = devAvailableDay.values().stream().max(Integer::compareTo).orElse(0);
        double avgSuitability = suitabilitySum / tasks.size();
        double variance = calculateVariance(devWorkload.values());

        // Objective function formulation to maximize
        return 1000.0 / (1.0 + (makespan * 5.0) + (variance * 1.5) + ((100.0 - avgSuitability) * 3.0) + (dependencyViolations * 100.0));
    }

    private int[] tournamentSelect(List<int[]> population, List<Double> fitnesses, Random rand) {
        int tournamentSize = 3;
        int bestIdx = rand.nextInt(population.size());
        double bestFit = fitnesses.get(bestIdx);
        for (int i = 1; i < tournamentSize; i++) {
            int candidateIdx = rand.nextInt(population.size());
            if (fitnesses.get(candidateIdx) > bestFit) {
                bestFit = fitnesses.get(candidateIdx);
                bestIdx = candidateIdx;
            }
        }
        return population.get(bestIdx);
    }

    private void mutate(int[] chromosome, int numDevs, Random rand) {
        for (int i = 0; i < chromosome.length; i++) {
            if (rand.nextDouble() < MUTATION_RATE) {
                chromosome[i] = rand.nextInt(numDevs);
            }
        }
    }

    private HeuristicOptimizer.OptimizationResult decodeChromosome(int[] chromosome, List<Task> tasks, List<Developer> developers, long startTime, HeuristicOptimizer.OptimizationResult result) {
        Map<Long, Integer> devAvailableDay = new HashMap<>();
        Map<Long, Double> devWorkload = new HashMap<>();
        for (Developer d : developers) {
            devAvailableDay.put(d.getId(), 0);
            devWorkload.put(d.getId(), d.getCurrentWorkload());
        }

        Map<Long, Integer> taskFinish = new HashMap<>();
        double totalCostSum = 0;
        double totalSuitabilitySum = 0;

        for (int i = 0; i < tasks.size(); i++) {
            Task task = tasks.get(i);
            Developer dev = developers.get(chromosome[i]);

            int earliestStart = 0;
            for (Long depId : task.getDependencyTaskIds()) {
                if (taskFinish.containsKey(depId)) {
                    earliestStart = Math.max(earliestStart, taskFinish.get(depId));
                }
            }

            int start = Math.max(earliestStart, devAvailableDay.get(dev.getId()));
            int finish = start + task.getEstimatedDurationDays();
            devAvailableDay.put(dev.getId(), finish);
            taskFinish.put(task.getId(), finish);

            double score = suitabilityCalculator.calculateSuitability(dev, task);
            totalSuitabilitySum += score;
            double cost = task.getEstimatedDurationDays() * 8.0 * dev.getHourlyRate();
            totalCostSum += cost;

            devWorkload.put(dev.getId(), devWorkload.get(dev.getId()) + task.getEstimatedDurationDays() * 8);

            HeuristicOptimizer.TaskAssignment assignment = new HeuristicOptimizer.TaskAssignment();
            assignment.taskId = task.getId();
            assignment.taskName = task.getName();
            assignment.developerId = dev.getId();
            assignment.developerName = dev.getName();
            assignment.startDay = start;
            assignment.endDay = finish;
            assignment.suitabilityScore = Math.round(score * 100.0) / 100.0;
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
