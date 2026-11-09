package com.optimization.scheduler.repository;

import com.optimization.scheduler.model.Developer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface DeveloperRepository extends JpaRepository<Developer, Long> {
    List<Developer> findByAvailable(boolean available);
    Optional<Developer> findByName(String name);
}
