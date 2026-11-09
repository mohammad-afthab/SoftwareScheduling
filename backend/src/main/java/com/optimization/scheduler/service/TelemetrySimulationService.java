package com.optimization.scheduler.service;

import com.optimization.scheduler.model.ServerNode;
import com.optimization.scheduler.model.TelemetryMetric;
import com.optimization.scheduler.repository.ServerNodeRepository;
import com.optimization.scheduler.repository.TelemetryMetricRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class TelemetrySimulationService {

    @Autowired
    private ServerNodeRepository serverNodeRepository;

    @Autowired
    private TelemetryMetricRepository telemetryMetricRepository;

    @Autowired(required = false)
    private SimpMessagingTemplate messagingTemplate;

    private final Random random = new Random();

    @Scheduled(fixedRate = 4000)
    public void generateRealtimeMetrics() {
        List<ServerNode> servers = serverNodeRepository.findAll();
        if (servers.isEmpty()) return;

        for (ServerNode server : servers) {
            // Fluctuate CPU between 30% and 95%
            double cpuDelta = (random.nextDouble() * 14.0) - 7.0;
            double newCpu = Math.max(15.0, Math.min(99.0, server.getCurrentCpuUsage() + cpuDelta));

            // Fluctuate Memory
            double memDelta = (random.nextDouble() * 10.0) - 5.0;
            double newMem = Math.max(20.0, Math.min(95.0, server.getCurrentMemoryUsage() + memDelta));

            int requests = Math.max(50, server.getActiveRequests() + random.nextInt(40) - 20);
            double latency = Math.max(5.0, 10.0 + (newCpu * 0.8) + (random.nextDouble() * 15.0));

            server.setCurrentCpuUsage(Math.round(newCpu * 10.0) / 10.0);
            server.setCurrentMemoryUsage(Math.round(newMem * 10.0) / 10.0);
            server.setActiveRequests(requests);
            server.setLatencyMs(Math.round(latency * 10.0) / 10.0);

            if (newCpu > 88.0 || newMem > 90.0) {
                server.setStatus("OVERLOADED");
            } else if (newCpu > 75.0) {
                server.setStatus("DEGRADED");
            } else {
                server.setStatus("ONLINE");
            }

            serverNodeRepository.save(server);

            // Record Metric History
            TelemetryMetric metric = new TelemetryMetric(
                    LocalDateTime.now(),
                    server.getId(),
                    server.getServerName(),
                    server.getCurrentCpuUsage(),
                    server.getCurrentMemoryUsage(),
                    server.getActiveRequests(),
                    server.getLatencyMs(),
                    Math.round((server.getCpuCores() * 0.05 + server.getMemoryGb() * 0.02) * 100.0) / 100.0
            );
            telemetryMetricRepository.save(metric);

            // Push real-time metric via WebSocket if enabled
            if (messagingTemplate != null) {
                messagingTemplate.convertAndSend("/topic/telemetry", metric);
            }
        }
    }
}
