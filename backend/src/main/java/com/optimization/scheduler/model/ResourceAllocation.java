package com.optimization.scheduler.model;

import jakarta.persistence.*;

@Entity
@Table(name = "resource_allocations")
public class ResourceAllocation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String applicationModule; // e.g. Payment API, User Login, Search, Report Generator

    private String cpuRequirementLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private int allocatedCpuCores;
    private int allocatedMemoryGb;
    private double expectedLatencyMs;
    private String optimizationAlgorithm; // HEURISTIC, GENETIC_ALGORITHM, Q_LEARNING

    @ManyToOne
    @JoinColumn(name = "assigned_server_id")
    private ServerNode assignedServer;

    public ResourceAllocation() {}

    public ResourceAllocation(String applicationModule, String cpuRequirementLevel, int allocatedCpuCores, int allocatedMemoryGb, double expectedLatencyMs, ServerNode assignedServer, String optimizationAlgorithm) {
        this.applicationModule = applicationModule;
        this.cpuRequirementLevel = cpuRequirementLevel;
        this.allocatedCpuCores = allocatedCpuCores;
        this.allocatedMemoryGb = allocatedMemoryGb;
        this.expectedLatencyMs = expectedLatencyMs;
        this.assignedServer = assignedServer;
        this.optimizationAlgorithm = optimizationAlgorithm;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getApplicationModule() { return applicationModule; }
    public void setApplicationModule(String applicationModule) { this.applicationModule = applicationModule; }

    public String getCpuRequirementLevel() { return cpuRequirementLevel; }
    public void setCpuRequirementLevel(String cpuRequirementLevel) { this.cpuRequirementLevel = cpuRequirementLevel; }

    public int getAllocatedCpuCores() { return allocatedCpuCores; }
    public void setAllocatedCpuCores(int allocatedCpuCores) { this.allocatedCpuCores = allocatedCpuCores; }

    public int getAllocatedMemoryGb() { return allocatedMemoryGb; }
    public void setAllocatedMemoryGb(int allocatedMemoryGb) { this.allocatedMemoryGb = allocatedMemoryGb; }

    public double getExpectedLatencyMs() { return expectedLatencyMs; }
    public void setExpectedLatencyMs(double expectedLatencyMs) { this.expectedLatencyMs = expectedLatencyMs; }

    public String getOptimizationAlgorithm() { return optimizationAlgorithm; }
    public void setOptimizationAlgorithm(String optimizationAlgorithm) { this.optimizationAlgorithm = optimizationAlgorithm; }

    public ServerNode getAssignedServer() { return assignedServer; }
    public void setAssignedServer(ServerNode assignedServer) { this.assignedServer = assignedServer; }
}
