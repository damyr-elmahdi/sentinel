package com.sentinel.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "sensor_nodes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SensorNode {

    @Id
    private String id;          // e.g. "SN-001"

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NodeStatus status = NodeStatus.ONLINE;

    private int batteryLevel;

    private LocalDateTime lastPing;

    private int alertCount;

    private String firmwareVersion;

    private Double latitude;
    private Double longitude;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

    public enum NodeStatus {
        ONLINE, OFFLINE, ALERT
    }
}
