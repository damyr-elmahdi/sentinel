package com.sentinel.repositories;

import com.sentinel.models.SensorNode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SensorNodeRepository extends JpaRepository<SensorNode, String> {
    List<SensorNode> findByStatus(SensorNode.NodeStatus status);
    long countByStatus(SensorNode.NodeStatus status);
}
