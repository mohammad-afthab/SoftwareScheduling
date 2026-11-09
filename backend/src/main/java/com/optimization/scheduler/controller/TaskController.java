package com.optimization.scheduler.controller;

import com.optimization.scheduler.model.Task;
import com.optimization.scheduler.model.Developer;
import com.optimization.scheduler.model.Project;
import com.optimization.scheduler.model.Skill;
import com.optimization.scheduler.repository.TaskRepository;
import com.optimization.scheduler.repository.DeveloperRepository;
import com.optimization.scheduler.repository.ProjectRepository;
import com.optimization.scheduler.repository.SkillRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private DeveloperRepository developerRepository;

    @Autowired
    private ProjectRepository projectRepository;

    private void recalculateDeveloperWorkload(Developer dev) {
        if (dev == null || dev.getId() == null) return;
        List<Task> assignedTasks = taskRepository.findByAssignedDeveloperId(dev.getId());
        double totalWorkload = 0.0;
        for (Task t : assignedTasks) {
            if (t.getStatus() != null && !"COMPLETED".equalsIgnoreCase(t.getStatus())) {
                int comp = t.getComplexity() > 0 ? t.getComplexity() : 5;
                int dur = t.getEstimatedDurationDays() > 0 ? t.getEstimatedDurationDays() : 3;
                totalWorkload += (comp * 5.0) + (dur * 3.0);
            }
        }
        double finalWorkload = Math.min(100.0, Math.max(0.0, totalWorkload));
        dev.setCurrentWorkload(finalWorkload);
        if (finalWorkload >= 75.0) {
            dev.setAvailable(false);
        } else {
            dev.setAvailable(true);
        }
        developerRepository.save(dev);
    }

    @GetMapping
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        return taskRepository.findById(id).orElse(null);
    }

    @GetMapping("/project/{projectId}")
    public List<Task> getTasksByProject(@PathVariable Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    @GetMapping("/developer/{developerId}")
    public List<Task> getTasksByDeveloper(@PathVariable Long developerId) {
        return taskRepository.findByAssignedDeveloperId(developerId);
    }

    @PostMapping
    public Task createTask(@RequestBody Task task) {
        Set<Skill> resolvedSkills = new HashSet<>();

        if (task.getRequiredSkills() != null) {
            for (Skill skill : task.getRequiredSkills()) {
                if (skill.getName() == null || skill.getName().trim().isEmpty()) {
                    continue;
                }

                skillRepository.findByName(skill.getName().trim())
                        .ifPresent(resolvedSkills::add);
            }
        }

        task.setRequiredSkills(resolvedSkills);

        if (task.getAssignedDeveloper() != null) {
            if (task.getAssignedDeveloper().getId() != null) {
                developerRepository.findById(task.getAssignedDeveloper().getId())
                        .ifPresent(task::setAssignedDeveloper);
            } else if (task.getAssignedDeveloper().getName() != null) {
                developerRepository.findByName(task.getAssignedDeveloper().getName().trim())
                        .ifPresent(task::setAssignedDeveloper);
            }
        }

        Task savedTask = taskRepository.save(task);
        if (savedTask.getAssignedDeveloper() != null) {
            recalculateDeveloperWorkload(savedTask.getAssignedDeveloper());
        }
        return savedTask;
    }

    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task updatedTask) {
        return taskRepository.findById(id).map(task -> {
            Developer previousDev = task.getAssignedDeveloper();

            if (updatedTask.getName() != null && !updatedTask.getName().trim().isEmpty()) {
                task.setName(updatedTask.getName());
            }
            if (updatedTask.getDescription() != null) {
                task.setDescription(updatedTask.getDescription());
            }
            if (updatedTask.getPriority() != null) {
                task.setPriority(updatedTask.getPriority());
            }
            if (updatedTask.getComplexity() > 0) {
                task.setComplexity(updatedTask.getComplexity());
            }
            if (updatedTask.getEstimatedDurationDays() > 0) {
                task.setEstimatedDurationDays(updatedTask.getEstimatedDurationDays());
            }
            if (updatedTask.getStatus() != null) {
                task.setStatus(updatedTask.getStatus());
            }

            // ── Link to project if provided ───────────────────────────────
            if (updatedTask.getProject() != null && updatedTask.getProject().getId() != null) {
                projectRepository.findById(updatedTask.getProject().getId())
                        .ifPresent(task::setProject);
            }

            if (updatedTask.getAssignedDeveloper() != null) {
                if (updatedTask.getAssignedDeveloper().getId() != null) {
                    developerRepository.findById(updatedTask.getAssignedDeveloper().getId())
                            .ifPresent(task::setAssignedDeveloper);
                } else if (updatedTask.getAssignedDeveloper().getName() != null) {
                    if (updatedTask.getAssignedDeveloper().getName().trim().isEmpty()) {
                        task.setAssignedDeveloper(null);
                    } else {
                        developerRepository.findByName(updatedTask.getAssignedDeveloper().getName().trim())
                                .ifPresent(task::setAssignedDeveloper);
                    }
                }
            }

            if (updatedTask.getRequiredSkills() != null && !updatedTask.getRequiredSkills().isEmpty()) {
                Set<Skill> resolvedSkills = new HashSet<>();
                for (Skill skill : updatedTask.getRequiredSkills()) {
                    if (skill.getName() != null && !skill.getName().trim().isEmpty()) {
                        skillRepository.findByName(skill.getName().trim())
                                .ifPresent(resolvedSkills::add);
                    }
                }
                task.setRequiredSkills(resolvedSkills);
            }

            if (updatedTask.getDependencyTaskIds() != null) {
                task.setDependencyTaskIds(updatedTask.getDependencyTaskIds());
            }

            Task saved = taskRepository.save(task);

            if (previousDev != null) {
                recalculateDeveloperWorkload(previousDev);
            }
            if (saved.getAssignedDeveloper() != null) {
                recalculateDeveloperWorkload(saved.getAssignedDeveloper());
            }

            return saved;
        }).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Long id) {
        taskRepository.findById(id).ifPresent(task -> {
            Developer dev = task.getAssignedDeveloper();
            taskRepository.deleteById(id);
            if (dev != null) {
                recalculateDeveloperWorkload(dev);
            }
        });
    }
}
