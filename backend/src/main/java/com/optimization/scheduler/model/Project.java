package com.optimization.scheduler.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    private LocalDate startDate;
    private LocalDate deadline;
    private double budget;
    private int progress = 0;
    private String status = "IN_PLANNING"; // IN_PLANNING, IN_PROGRESS, COMPLETED, DELAYED

    public Project() {}

    public Project(String name, String description, LocalDate startDate, LocalDate deadline, double budget) {
        this.name = name;
        this.description = description;
        this.startDate = startDate;
        this.deadline = deadline;
        this.budget = budget;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }

    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }

    public double getBudget() { return budget; }
    public void setBudget(double budget) { this.budget = budget; }

    public int getProgress() { return progress; }
    public void setProgress(int progress) { this.progress = progress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
