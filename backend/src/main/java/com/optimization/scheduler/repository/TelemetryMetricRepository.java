package com.optimization.scheduler.repository;

import com.optimization.scheduler.model.TelemetryMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TelemetryMetricRepository extends JpaRepository<TelemetryMetric, Long> {
    List<TelemetryMetric> findTop30ByServerIdOrderByTimestampDesc(Long serverId);
    List<TelemetryMetric> findTop50ByOrderByTimestampDesc();
}
