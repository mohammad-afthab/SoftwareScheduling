package com.optimization.scheduler.engine;

import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Skill;
import com.optimization.scheduler.model.Task;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
public class SuitabilityCalculator {

    /**
     * Calculates suitability score between 0.0 and 100.0% for a developer and a task.
     */
    public double calculateSuitability(Developer developer, Task task) {
        if (!developer.isAvailable()) {
            return 0.0;
        }

        Set<Skill> requiredSkills = task.getRequiredSkills();
        Set<Skill> devSkills = developer.getSkills();

        if (requiredSkills.isEmpty()) {
            return 70.0; // baseline if no specific skills specified
        }

        // 1. Skill Match Ratio (40% weight)
        long matchedCount = requiredSkills.stream()
                .filter(req -> devSkills.stream().anyMatch(devSkill -> devSkill.getName().equalsIgnoreCase(req.getName())))
                .count();
        double skillMatchRatio = (double) matchedCount / requiredSkills.size();
        double skillScore = skillMatchRatio * 40.0;

        // 2. Experience Score (20% weight)
        double expScore = Math.min(developer.getYearsExperience() / 10.0, 1.0) * 20.0;

        // 3. Performance Rating Score (20% weight)
        double perfScore = (developer.getPerformanceRating() / 5.0) * 20.0;

        // 4. Workload Penalty (20% weight)
        double workloadPenalty = (developer.getCurrentWorkload() / 100.0) * 20.0;

        double finalScore = skillScore + expScore + perfScore - workloadPenalty;
        return Math.max(0.0, Math.min(100.0, finalScore));
    }
}
