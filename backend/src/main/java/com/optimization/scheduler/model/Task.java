package com.optimization.scheduler.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Enumerated(EnumType.STRING)
    private TaskPriority priority = TaskPriority.MEDIUM;

    private int complexity; // 1 to 10 scale
    private int estimatedDurationDays;
    private String status = "NOT_STARTED"; // NOT_STARTED, IN_PROGRESS, COMPLETED, DELAYED, BLOCKED

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "assigned_developer_id")
    private Developer assignedDeveloper;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "task_required_skills",
        joinColumns = @JoinColumn(name = "task_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> requiredSkills = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "task_dependencies", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "dependent_task_id")
    private Set<Long> dependencyTaskIds = new HashSet<>();

    private Integer calculatedStartDay = 0;
    private Integer calculatedEndDay = 0;
    private Double suitabilityScore = 0.0;

    public enum TaskPriority {
        LOW, MEDIUM, HIGH, VERY_HIGH, CRITICAL
    }

    public Task() {}

    public Task(String name, String description, TaskPriority priority, int complexity, int estimatedDurationDays, Project project) {
        this.name = name;
        this.description = description;
        this.priority = priority;
        this.complexity = complexity;
        this.estimatedDurationDays = estimatedDurationDays;
        this.project = project;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public TaskPriority getPriority() { return priority; }
    public void setPriority(TaskPriority priority) { this.priority = priority; }

    public int getComplexity() { return complexity; }
    public void setComplexity(int complexity) { this.complexity = complexity; }

    public int getEstimatedDurationDays() { return estimatedDurationDays; }
    public void setEstimatedDurationDays(int estimatedDurationDays) { this.estimatedDurationDays = estimatedDurationDays; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }

    public Developer getAssignedDeveloper() { return assignedDeveloper; }
    public void setAssignedDeveloper(Developer assignedDeveloper) { this.assignedDeveloper = assignedDeveloper; }

    public Set<Skill> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(Set<Skill> requiredSkills) { this.requiredSkills = requiredSkills; }

    public Set<Long> getDependencyTaskIds() { return dependencyTaskIds; }
    public void setDependencyTaskIds(Set<Long> dependencyTaskIds) { this.dependencyTaskIds = dependencyTaskIds; }

    public Integer getCalculatedStartDay() { return calculatedStartDay; }
    public void setCalculatedStartDay(Integer calculatedStartDay) { this.calculatedStartDay = calculatedStartDay; }

    public Integer getCalculatedEndDay() { return calculatedEndDay; }
    public void setCalculatedEndDay(Integer calculatedEndDay) { this.calculatedEndDay = calculatedEndDay; }

    public Double getSuitabilityScore() { return suitabilityScore; }
    public void setSuitabilityScore(Double suitabilityScore) { this.suitabilityScore = suitabilityScore; }
}
