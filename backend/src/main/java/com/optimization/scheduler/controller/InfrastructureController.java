package com.optimization.scheduler.controller;

import com.optimization.scheduler.model.ResourceAllocation;
import com.optimization.scheduler.model.ServerNode;
import com.optimization.scheduler.model.TelemetryMetric;
import com.optimization.scheduler.repository.ResourceAllocationRepository;
import com.optimization.scheduler.repository.ServerNodeRepository;
import com.optimization.scheduler.repository.TelemetryMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/infrastructure")
@CrossOrigin(origins = "*")
public class InfrastructureController {

    @Autowired
    private ServerNodeRepository serverNodeRepository;

    @Autowired
    private ResourceAllocationRepository resourceAllocationRepository;

    @Autowired
    private TelemetryMetricRepository telemetryMetricRepository;

    @GetMapping("/servers")
    public List<ServerNode> getAllServers() {
        return serverNodeRepository.findAll();
    }

    @PostMapping("/servers")
    public ServerNode createServer(@RequestBody ServerNode serverNode) {
        return serverNodeRepository.save(serverNode);
    }

    @GetMapping("/allocations")
    public List<ResourceAllocation> getAllocations() {
        return resourceAllocationRepository.findAll();
    }

    @PostMapping("/reallocate")
    public ResponseEntity<Map<String, Object>> triggerDynamicReallocation() {
        List<ServerNode> servers = serverNodeRepository.findAll();
        List<ResourceAllocation> allocations = resourceAllocationRepository.findAll();

        if (servers.isEmpty() || allocations.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        // Find least loaded server
        ServerNode leastLoadedServer = servers.stream()
                .min(Comparator.comparingDouble(ServerNode::getCurrentCpuUsage))
                .orElse(servers.get(0));

        // Shift overloaded allocations to least loaded server
        int reallocatedCount = 0;
        for (ResourceAllocation alloc : allocations) {
            if (alloc.getAssignedServer() != null && alloc.getAssignedServer().getCurrentCpuUsage() > 80.0) {
                alloc.setAssignedServer(leastLoadedServer);
                alloc.setOptimizationAlgorithm("DYNAMIC_REALLOCATION_AI");
                resourceAllocationRepository.save(alloc);
                reallocatedCount++;
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("status", "SUCCESS");
        result.put("message", "Dynamic AI Infrastructure Reallocation Triggered");
        result.put("reallocatedModulesCount", reallocatedCount);
        result.put("targetServer", leastLoadedServer.getServerName());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/metrics/recent")
    public List<TelemetryMetric> getRecentMetrics() {
        return telemetryMetricRepository.findTop50ByOrderByTimestampDesc();
    }
}
