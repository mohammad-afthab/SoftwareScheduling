package com.optimization.scheduler.model;

import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "developers")
public class Developer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private int yearsExperience;
    private double currentWorkload; // percentage 0.0 to 100.0
    private double hourlyRate; // in USD or INR
    private double performanceRating; // 1.0 to 5.0 scale
    private boolean available = true;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "developer_skills",
        joinColumns = @JoinColumn(name = "developer_id"),
        inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

    public Developer() {}

    public Developer(String name, String email, int yearsExperience, double currentWorkload, double hourlyRate, double performanceRating) {
        this.name = name;
        this.email = email;
        this.yearsExperience = yearsExperience;
        this.currentWorkload = currentWorkload;
        this.hourlyRate = hourlyRate;
        this.performanceRating = performanceRating;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getYearsExperience() { return yearsExperience; }
    public void setYearsExperience(int yearsExperience) { this.yearsExperience = yearsExperience; }

    public double getCurrentWorkload() { return currentWorkload; }
    public void setCurrentWorkload(double currentWorkload) { this.currentWorkload = currentWorkload; }

    public double getHourlyRate() { return hourlyRate; }
    public void setHourlyRate(double hourlyRate) { this.hourlyRate = hourlyRate; }

    public double getPerformanceRating() { return performanceRating; }
    public void setPerformanceRating(double performanceRating) { this.performanceRating = performanceRating; }

    public boolean isAvailable() { return available; }
    public void setAvailable(boolean available) { this.available = available; }

    public Set<Skill> getSkills() { return skills; }
    public void setSkills(Set<Skill> skills) { this.skills = skills; }
}
