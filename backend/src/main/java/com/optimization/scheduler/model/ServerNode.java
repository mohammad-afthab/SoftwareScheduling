package com.optimization.scheduler.model;

import jakarta.persistence.*;

@Entity
@Table(name = "server_nodes")
public class ServerNode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String serverName;

    private int cpuCores;
    private int memoryGb;
    private double currentCpuUsage; // percentage 0.0 to 100.0
    private double currentMemoryUsage; // percentage 0.0 to 100.0
    private int activeRequests;
    private double latencyMs;
    private String status = "ONLINE"; // ONLINE, OVERLOADED, MAINTENANCE, DEGRADED

    public ServerNode() {}

    public ServerNode(String serverName, int cpuCores, int memoryGb, double currentCpuUsage, double currentMemoryUsage, int activeRequests, double latencyMs) {
        this.serverName = serverName;
        this.cpuCores = cpuCores;
        this.memoryGb = memoryGb;
        this.currentCpuUsage = currentCpuUsage;
        this.currentMemoryUsage = currentMemoryUsage;
        this.activeRequests = activeRequests;
        this.latencyMs = latencyMs;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getServerName() { return serverName; }
    public void setServerName(String serverName) { this.serverName = serverName; }

    public int getCpuCores() { return cpuCores; }
    public void setCpuCores(int cpuCores) { this.cpuCores = cpuCores; }

    public int getMemoryGb() { return memoryGb; }
    public void setMemoryGb(int memoryGb) { this.memoryGb = memoryGb; }

    public double getCurrentCpuUsage() { return currentCpuUsage; }
    public void setCurrentCpuUsage(double currentCpuUsage) { this.currentCpuUsage = currentCpuUsage; }

    public double getCurrentMemoryUsage() { return currentMemoryUsage; }
    public void setCurrentMemoryUsage(double currentMemoryUsage) { this.currentMemoryUsage = currentMemoryUsage; }

    public int getActiveRequests() { return activeRequests; }
    public void setActiveRequests(int activeRequests) { this.activeRequests = activeRequests; }

    public double getLatencyMs() { return latencyMs; }
    public void setLatencyMs(double latencyMs) { this.latencyMs = latencyMs; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
