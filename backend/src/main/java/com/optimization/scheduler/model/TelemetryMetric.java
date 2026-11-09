package com.optimization.scheduler.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "telemetry_metrics")
public class TelemetryMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime timestamp;
    private Long serverId;
    private String serverName;
    private double cpuUsagePercent;
    private double memoryUsagePercent;
    private int activeRequests;
    private double latencyMs;
    private double estimatedHourlyCost;

    public TelemetryMetric() {}

    public TelemetryMetric(LocalDateTime timestamp, Long serverId, String serverName, double cpuUsagePercent, double memoryUsagePercent, int activeRequests, double latencyMs, double estimatedHourlyCost) {
        this.timestamp = timestamp;
        this.serverId = serverId;
        this.serverName = serverName;
        this.cpuUsagePercent = cpuUsagePercent;
        this.memoryUsagePercent = memoryUsagePercent;
        this.activeRequests = activeRequests;
        this.latencyMs = latencyMs;
        this.estimatedHourlyCost = estimatedHourlyCost;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public Long getServerId() { return serverId; }
    public void setServerId(Long serverId) { this.serverId = serverId; }

    public String getServerName() { return serverName; }
    public void setServerName(String serverName) { this.serverName = serverName; }

    public double getCpuUsagePercent() { return cpuUsagePercent; }
    public void setCpuUsagePercent(double cpuUsagePercent) { this.cpuUsagePercent = cpuUsagePercent; }

    public double getMemoryUsagePercent() { return memoryUsagePercent; }
    public void setMemoryUsagePercent(double memoryUsagePercent) { this.memoryUsagePercent = memoryUsagePercent; }

    public int getActiveRequests() { return activeRequests; }
    public void setActiveRequests(int activeRequests) { this.activeRequests = activeRequests; }

    public double getLatencyMs() { return latencyMs; }
    public void setLatencyMs(double latencyMs) { this.latencyMs = latencyMs; }

    public double getEstimatedHourlyCost() { return estimatedHourlyCost; }
    public void setEstimatedHourlyCost(double estimatedHourlyCost) { this.estimatedHourlyCost = estimatedHourlyCost; }
}
