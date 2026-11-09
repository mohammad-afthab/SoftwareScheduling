package com.optimization.scheduler.controller;

import com.optimization.scheduler.model.Project;
import com.optimization.scheduler.model.Task;
import com.optimization.scheduler.repository.ProjectRepository;
import com.optimization.scheduler.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private TaskRepository taskRepository;

    @GetMapping
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    @PostMapping
    public Project createProject(@RequestBody Project project) {
        return projectRepository.save(project);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id) {
        return projectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject) {
        return projectRepository.findById(id).map(project -> {
            if (updatedProject.getName() != null && !updatedProject.getName().trim().isEmpty()) {
                project.setName(updatedProject.getName());
            }
            if (updatedProject.getDescription() != null) {
                project.setDescription(updatedProject.getDescription());
            }
            if (updatedProject.getStartDate() != null) {
                project.setStartDate(updatedProject.getStartDate());
            }
            if (updatedProject.getDeadline() != null) {
                project.setDeadline(updatedProject.getDeadline());
            }
            if (updatedProject.getBudget() > 0) {
                project.setBudget(updatedProject.getBudget());
            }
            if (updatedProject.getProgress() >= 0) {
                project.setProgress(updatedProject.getProgress());
            }
            if (updatedProject.getStatus() != null) {
                project.setStatus(updatedProject.getStatus());
            }
            return ResponseEntity.ok(projectRepository.save(project));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/{id}/tasks")
    public List<Task> getProjectTasks(@PathVariable Long id) {
        return taskRepository.findByProjectId(id);
    }

    @PostMapping("/{id}/tasks")
    public ResponseEntity<Task> addTaskToProject(@PathVariable Long id, @RequestBody Task task) {
        return projectRepository.findById(id).map(project -> {
            task.setProject(project);
            return ResponseEntity.ok(taskRepository.save(task));
        }).orElse(ResponseEntity.notFound().build());
    }
}
