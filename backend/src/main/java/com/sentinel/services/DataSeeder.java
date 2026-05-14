package com.sentinel.services;

import com.sentinel.models.*;
import com.sentinel.repositories.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * Seeds the in-memory H2 database with demo data on application startup.
 * Only active when NOT running the "prod" profile.
 */
@Slf4j
@Component
@RequiredArgsConstructor
@Profile("!prod")
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final TaskRepository taskRepository;
    private final MessageRepository messageRepository;
    private final SensorNodeRepository sensorNodeRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("🌱  Seeding development data...");
        seedUsers();
        seedSensors();
        seedShifts();
        seedTasks();
        seedMessages();
        log.info("✅  Seeding complete.");
    }

    private void seedUsers() {
        User admin = User.builder()
            .username("admin")
            .email("admin@sentinel.io")
            .password(passwordEncoder.encode("admin123"))
            .fullName("System Administrator")
            .role(User.Role.ADMIN)
            .provider(User.AuthProvider.LOCAL)
            .build();

        User emp1 = User.builder()
            .username("m.reeves")
            .email("m.reeves@sentinel.io")
            .password(passwordEncoder.encode("password123"))
            .fullName("Marcus Reeves")
            .role(User.Role.EMPLOYEE)
            .provider(User.AuthProvider.LOCAL)
            .build();

        User emp2 = User.builder()
            .username("p.okoye")
            .email("p.okoye@sentinel.io")
            .password(passwordEncoder.encode("password123"))
            .fullName("Priya Okoye")
            .role(User.Role.EMPLOYEE)
            .provider(User.AuthProvider.LOCAL)
            .build();

        userRepository.save(admin);
        userRepository.save(emp1);
        userRepository.save(emp2);
        log.info("  ✓ Users seeded (admin@sentinel.io / admin123)");
    }

    private void seedSensors() {
        var sensors = java.util.List.of(
            buildSensor("SN-001", "Main Gate Alpha",   "Sector A - Entrance",   SensorNode.NodeStatus.ONLINE,  87,  0),
            buildSensor("SN-002", "Server Room Core",  "Sector B - Interior",   SensorNode.NodeStatus.ALERT,   23,  3),
            buildSensor("SN-003", "Perimeter West",    "Outer Ring - West",     SensorNode.NodeStatus.ONLINE,  62,  0),
            buildSensor("SN-004", "Parking Lot Node",  "Sector C - Exterior",   SensorNode.NodeStatus.OFFLINE, 0,   0),
            buildSensor("SN-005", "Rooftop Scanner",   "Roof Level 1",          SensorNode.NodeStatus.ONLINE,  94,  0),
            buildSensor("SN-006", "Emergency Exit B",  "Sector D - South",      SensorNode.NodeStatus.ALERT,   45,  1),
            buildSensor("SN-007", "Lobby Monitor",     "Main Building Floor 1", SensorNode.NodeStatus.ONLINE,  78,  0),
            buildSensor("SN-008", "Warehouse Zone",    "Sector E - Loading",    SensorNode.NodeStatus.OFFLINE, 12,  0)
        );
        sensorNodeRepository.saveAll(sensors);
        log.info("  ✓ Sensor nodes seeded");
    }

    private SensorNode buildSensor(String id, String name, String loc,
                                   SensorNode.NodeStatus status, int battery, int alerts) {
        return SensorNode.builder()
            .id(id).name(name).location(loc)
            .status(status).batteryLevel(battery)
            .lastPing(LocalDateTime.now().minusMinutes((long)(Math.random() * 60)))
            .alertCount(alerts).firmwareVersion("4.2.1")
            .build();
    }

    private void seedShifts() {
        User emp = userRepository.findByEmail("m.reeves@sentinel.io").orElseThrow();
        for (int i = 0; i < 7; i++) {
            Shift shift = Shift.builder()
                .user(emp)
                .date(LocalDate.now().plusDays(i))
                .startTime(LocalTime.of(8, 0))
                .endTime(LocalTime.of(16, 0))
                .location("Sector A - Main Gate")
                .status(i == 0 ? Shift.ShiftStatus.ACTIVE : Shift.ShiftStatus.SCHEDULED)
                .build();
            shiftRepository.save(shift);
        }
        log.info("  ✓ Shifts seeded");
    }

    private void seedTasks() {
        User emp = userRepository.findByEmail("m.reeves@sentinel.io").orElseThrow();
        User admin = userRepository.findByEmail("admin@sentinel.io").orElseThrow();

        var tasks = java.util.List.of(
            Task.builder().title("Inspect perimeter sensors")
                .description("Run diagnostics on all outer ring IoT nodes.")
                .priority(Task.Priority.CRITICAL).status(Task.TaskStatus.PENDING)
                .assignedTo(emp).createdBy(admin)
                .dueDate(LocalDateTime.now().plusHours(4)).build(),

            Task.builder().title("Submit incident report #2847")
                .description("Complete and file the incident report from last night's motion alert.")
                .priority(Task.Priority.HIGH).status(Task.TaskStatus.IN_PROGRESS)
                .assignedTo(emp).createdBy(admin)
                .dueDate(LocalDateTime.now().plusHours(2)).build(),

            Task.builder().title("Update access credentials")
                .description("Rotate personal access tokens per quarterly security policy.")
                .priority(Task.Priority.MEDIUM).status(Task.TaskStatus.PENDING)
                .assignedTo(emp).createdBy(admin)
                .dueDate(LocalDateTime.now().plusDays(1)).build()
        );
        taskRepository.saveAll(tasks);
        log.info("  ✓ Tasks seeded");
    }

    private void seedMessages() {
        User emp = userRepository.findByEmail("m.reeves@sentinel.io").orElseThrow();
        User admin = userRepository.findByEmail("admin@sentinel.io").orElseThrow();

        Message alert = Message.builder()
            .subject("⚠ ALERT: Anomaly Detected in Zone D")
            .body("Unauthorized access attempt detected on sensor D-04. Immediate sweep required.")
            .type(Message.MessageType.ALERT)
            .sender(admin).recipient(emp)
            .broadcast(false).read(false).build();

        Message broadcast = Message.builder()
            .subject("Scheduled Maintenance — Firmware Update")
            .body("All IoT nodes in Sector A will be taken offline Jan 20 02:00–06:00 for updates.")
            .type(Message.MessageType.BROADCAST)
            .sender(admin).recipient(emp)
            .broadcast(true).read(false).build();

        messageRepository.save(alert);
        messageRepository.save(broadcast);
        log.info("  ✓ Messages seeded");
    }
}
