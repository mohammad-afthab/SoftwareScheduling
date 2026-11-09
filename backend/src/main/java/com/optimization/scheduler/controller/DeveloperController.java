package com.optimization.scheduler.controller;

import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Skill;
import com.optimization.scheduler.repository.DeveloperRepository;
import com.optimization.scheduler.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/developers")
@CrossOrigin(origins = "*")
public class DeveloperController {

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private SkillRepository skillRepository;

    @GetMapping
    public List<Developer> getAllDevelopers() {
        return developerRepository.findAll();
    }

    @PostMapping
    public Developer createDeveloper(@RequestBody Developer developer) {
        if (developer.getSkills() != null && !developer.getSkills().isEmpty()) {
            java.util.Set<Skill> resolvedSkills = developer.getSkills().stream()
                    .map(skill -> skillRepository.findByName(skill.getName())
                            .orElseGet(() -> skillRepository.save(skill)))
                    .collect(java.util.stream.Collectors.toSet());
            developer.setSkills(resolvedSkills);
        }
        return developerRepository.save(developer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Developer> getDeveloperById(@PathVariable Long id) {
        return developerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Developer> updateDeveloper(@PathVariable Long id, @RequestBody Developer updated) {
        return developerRepository.findById(id).map(dev -> {
            if (updated.getName() != null && !updated.getName().trim().isEmpty()) {
                dev.setName(updated.getName());
            }
            if (updated.getEmail() != null) {
                dev.setEmail(updated.getEmail());
            }
            if (updated.getYearsExperience() > 0) {
                dev.setYearsExperience(updated.getYearsExperience());
            }
            if (updated.getCurrentWorkload() >= 0) {
                dev.setCurrentWorkload(updated.getCurrentWorkload());
            }
            if (updated.getHourlyRate() > 0) {
                dev.setHourlyRate(updated.getHourlyRate());
            }
            if (updated.getPerformanceRating() > 0) {
                dev.setPerformanceRating(updated.getPerformanceRating());
            }
            dev.setAvailable(updated.isAvailable());
            if (updated.getSkills() != null && !updated.getSkills().isEmpty()) {
                java.util.Set<Skill> resolvedSkills = updated.getSkills().stream()
                        .map(skill -> skillRepository.findByName(skill.getName())
                                .orElseGet(() -> skillRepository.save(skill)))
                        .collect(java.util.stream.Collectors.toSet());
                dev.setSkills(resolvedSkills);
            }
            return ResponseEntity.ok(developerRepository.save(dev));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDeveloper(@PathVariable Long id) {
        if (developerRepository.existsById(id)) {
            developerRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/skills")
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @PostMapping("/skills")
    public Skill createSkill(@RequestBody Skill skill) {
        return skillRepository.save(skill);
    }
}
