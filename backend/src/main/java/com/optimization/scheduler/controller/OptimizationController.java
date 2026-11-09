package com.optimization.scheduler.controller;

import com.optimization.scheduler.engine.GeneticAlgorithmOptimizer;
import com.optimization.scheduler.engine.HeuristicOptimizer;
import com.optimization.scheduler.engine.QLearningOptimizer;
import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Task;
import com.optimization.scheduler.repository.DeveloperRepository;
import com.optimization.scheduler.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/optimization")
@CrossOrigin(origins = "*")
public class OptimizationController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private HeuristicOptimizer heuristicOptimizer;

    @Autowired
    private GeneticAlgorithmOptimizer geneticAlgorithmOptimizer;

    @Autowired
    private QLearningOptimizer qLearningOptimizer;

    @GetMapping("/heuristic")
    public ResponseEntity<HeuristicOptimizer.OptimizationResult> runHeuristic() {
        List<Task> tasks = taskRepository.findAll();
        List<Developer> developers = developerRepository.findAll();
        return ResponseEntity.ok(heuristicOptimizer.optimize(tasks, developers));
    }

    @GetMapping("/genetic")
    public ResponseEntity<HeuristicOptimizer.OptimizationResult> runGenetic() {
        List<Task> tasks = taskRepository.findAll();
        List<Developer> developers = developerRepository.findAll();
        return ResponseEntity.ok(geneticAlgorithmOptimizer.optimize(tasks, developers));
    }

    @GetMapping("/q-learning")
    public ResponseEntity<HeuristicOptimizer.OptimizationResult> runQLearning() {
        List<Task> tasks = taskRepository.findAll();
        List<Developer> developers = developerRepository.findAll();
        return ResponseEntity.ok(qLearningOptimizer.optimize(tasks, developers));
    }

    @GetMapping("/compare-all")
    public ResponseEntity<Map<String, Object>> compareAllAlgorithms() {
        List<Task> tasks = taskRepository.findAll();
        List<Developer> developers = developerRepository.findAll();

        HeuristicOptimizer.OptimizationResult heuristic = heuristicOptimizer.optimize(tasks, developers);
        HeuristicOptimizer.OptimizationResult genetic = geneticAlgorithmOptimizer.optimize(tasks, developers);
        HeuristicOptimizer.OptimizationResult qlearning = qLearningOptimizer.optimize(tasks, developers);

        Map<String, Object> comparison = new HashMap<>();
        comparison.put("heuristic", heuristic);
        comparison.put("genetic", genetic);
        comparison.put("qlearning", qlearning);

        // Calculate Best Winner based on composite fitness score
        Map<String, String> summary = new HashMap<>();
        summary.put("fastestExecution", heuristic.executionTimeMs <= genetic.executionTimeMs ? "Heuristic" : "Genetic Algorithm");
        summary.put("bestMakespan", getMinMakespanWinner(heuristic, genetic, qlearning));
        summary.put("bestSuitability", getMaxSuitabilityWinner(heuristic, genetic, qlearning));
        summary.put("lowestWorkloadVariance", getMinVarianceWinner(heuristic, genetic, qlearning));

        comparison.put("summary", summary);
        return ResponseEntity.ok(comparison);
    }

    private String getMinMakespanWinner(HeuristicOptimizer.OptimizationResult h, HeuristicOptimizer.OptimizationResult g, HeuristicOptimizer.OptimizationResult q) {
        int min = Math.min(h.totalMakespanDays, Math.min(g.totalMakespanDays, q.totalMakespanDays));
        if (min == g.totalMakespanDays) return "Genetic Algorithm (" + g.totalMakespanDays + " Days)";
        if (min == q.totalMakespanDays) return "Q-Learning (" + q.totalMakespanDays + " Days)";
        return "Heuristic (" + h.totalMakespanDays + " Days)";
    }

    private String getMaxSuitabilityWinner(HeuristicOptimizer.OptimizationResult h, HeuristicOptimizer.OptimizationResult g, HeuristicOptimizer.OptimizationResult q) {
        double max = Math.max(h.averageSuitability, Math.max(g.averageSuitability, q.averageSuitability));
        if (max == g.averageSuitability) return "Genetic Algorithm (" + g.averageSuitability + "%)";
        if (max == q.averageSuitability) return "Q-Learning (" + q.averageSuitability + "%)";
        return "Heuristic (" + h.averageSuitability + "%)";
    }

    private String getMinVarianceWinner(HeuristicOptimizer.OptimizationResult h, HeuristicOptimizer.OptimizationResult g, HeuristicOptimizer.OptimizationResult q) {
        double min = Math.min(h.workloadVariance, Math.min(g.workloadVariance, q.workloadVariance));
        if (min == g.workloadVariance) return "Genetic Algorithm (Variance: " + g.workloadVariance + ")";
        if (min == q.workloadVariance) return "Q-Learning (Variance: " + q.workloadVariance + ")";
        return "Heuristic (Variance: " + h.workloadVariance + ")";
    }
}
