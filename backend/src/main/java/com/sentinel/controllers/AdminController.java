package com.sentinel.controllers;

import com.sentinel.models.*;
import com.sentinel.repositories.UserRepository;
import com.sentinel.security.UserPrincipal;
import com.sentinel.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    private User resolveUser(UserPrincipal principal) {
        return userRepository.findByEmail(principal.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── Sensor Nodes ─────────────────────────────────────

    @GetMapping("/sensors")
    public ResponseEntity<List<SensorNode>> getSensors() {
        return ResponseEntity.ok(adminService.getAllSensors());
    }

    @GetMapping("/sensors/{id}")
    public ResponseEntity<SensorNode> getSensor(@PathVariable String id) {
        return ResponseEntity.ok(adminService.getSensor(id));
    }

    // ── Employee Management ──────────────────────────────

    @GetMapping("/employees")
    public ResponseEntity<List<User>> getAllEmployees() {
        return ResponseEntity.ok(adminService.getAllEmployees());
    }

    @PostMapping("/employees")
    public ResponseEntity<User> createEmployee(@RequestBody Map<String, Object> body) {
        User user = adminService.createEmployee(
            (String) body.get("fullName"),
            (String) body.get("email"),
            (String) body.get("username"),
            (String) body.get("department"),
            (String) body.getOrDefault("password", "changeme123"),
            body.get("role") != null ? User.Role.valueOf((String) body.get("role")) : null
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }

    @PutMapping("/employees/{id}")
    public ResponseEntity<User> updateEmployee(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        User user = adminService.updateEmployee(
            id,
            (String) body.get("fullName"),
            (String) body.get("email"),
            User.Role.valueOf((String) body.getOrDefault("role", "EMPLOYEE")),
            (Boolean) body.getOrDefault("enabled", true)
        );
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/employees/{id}")
    public ResponseEntity<Void> deleteEmployee(@PathVariable Long id) {
        adminService.deleteEmployee(id);
        return ResponseEntity.noContent().build();
    }

    // ── Task Oversight ───────────────────────────────────

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(adminService.getAllTasks());
    }

    @PostMapping("/tasks")
    public ResponseEntity<Task> createTask(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        Task task = adminService.createTask(
            (String) body.get("title"),
            (String) body.get("description"),
            Task.Priority.valueOf((String) body.getOrDefault("priority", "MEDIUM")),
            body.get("assignedToId") != null ? Long.valueOf(body.get("assignedToId").toString()) : null,
            body.get("dueDate") != null ? LocalDateTime.parse((String) body.get("dueDate")) : null,
            resolveUser(principal)
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @PutMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Task task = adminService.updateTask(
            id,
            (String) body.get("title"),
            (String) body.get("description"),
            Task.Priority.valueOf((String) body.getOrDefault("priority", "MEDIUM")),
            Task.TaskStatus.valueOf((String) body.getOrDefault("status", "PENDING")),
            body.get("assignedToId") != null ? Long.valueOf(body.get("assignedToId").toString()) : null,
            body.get("dueDate") != null ? LocalDateTime.parse((String) body.get("dueDate")) : null
        );
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        adminService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // ── Schedule CRUD ────────────────────────────────────

    @GetMapping("/schedules")
    public ResponseEntity<List<Shift>> getAllSchedules() {
        return ResponseEntity.ok(adminService.getAllShifts());
    }

    @PostMapping("/schedules")
    public ResponseEntity<Shift> createShift(@RequestBody Map<String, Object> body) {
        Shift shift = adminService.createShift(
            Long.valueOf(body.get("userId").toString()),
            LocalDate.parse((String) body.get("date")),
            LocalTime.parse((String) body.get("startTime")),
            LocalTime.parse((String) body.get("endTime")),
            (String) body.get("location"),
            (String) body.get("notes")
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(shift);
    }

    @PutMapping("/schedules/{id}")
    public ResponseEntity<Shift> updateShift(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Shift shift = adminService.updateShift(
            id,
            LocalDate.parse((String) body.get("date")),
            LocalTime.parse((String) body.get("startTime")),
            LocalTime.parse((String) body.get("endTime")),
            (String) body.get("location"),
            Shift.ShiftStatus.valueOf((String) body.getOrDefault("status", "SCHEDULED"))
        );
        return ResponseEntity.ok(shift);
    }

    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteShift(@PathVariable Long id) {
        adminService.deleteShift(id);
        return ResponseEntity.noContent().build();
    }

    // ── Broadcast ────────────────────────────────────────

    @PostMapping("/broadcast")
    public ResponseEntity<Map<String, String>> broadcast(
            @RequestBody Map<String, Object> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        adminService.broadcastMessage(
            (String) body.get("subject"),
            (String) body.get("body"),
            Message.MessageType.valueOf((String) body.getOrDefault("type", "INFO")),
            resolveUser(principal),
            body.get("recipientId") != null ? Long.valueOf(body.get("recipientId").toString()) : null
        );
        return ResponseEntity.ok(Map.of("status", "Message broadcast successfully"));
    }
}
