package com.optimization.scheduler.repository;

import com.optimization.scheduler.model.ServerNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ServerNodeRepository extends JpaRepository<ServerNode, Long> {
    Optional<ServerNode> findByServerName(String serverName);
}
