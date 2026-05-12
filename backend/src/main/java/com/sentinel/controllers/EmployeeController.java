package com.sentinel.controllers;

import com.sentinel.models.*;
import com.sentinel.repositories.UserRepository;
import com.sentinel.security.UserPrincipal;
import com.sentinel.services.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/employee")
@PreAuthorize("hasAnyRole('EMPLOYEE','ADMIN')")
@RequiredArgsConstructor
public class EmployeeController {

    private final EmployeeService employeeService;
    private final UserRepository userRepository;

    private User resolveUser(UserPrincipal principal) {
        return userRepository.findByEmail(principal.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── Shifts ──────────────────────────────────────────

    @GetMapping("/shifts")
    public ResponseEntity<List<Shift>> getMyShifts(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.getMyShifts(resolveUser(principal)));
    }

    @GetMapping("/shifts/upcoming")
    public ResponseEntity<List<Shift>> getUpcomingShifts(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.getUpcomingShifts(resolveUser(principal)));
    }

    // ── Time Logging ────────────────────────────────────

    @PostMapping("/timelog/clockin")
    public ResponseEntity<TimeLog> clockIn(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.clockIn(resolveUser(principal)));
    }

    @PostMapping("/timelog/clockout")
    public ResponseEntity<TimeLog> clockOut(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.clockOut(resolveUser(principal)));
    }

    @GetMapping("/timelog")
    public ResponseEntity<List<TimeLog>> getTimeLogs(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.getMyTimeLogs(resolveUser(principal)));
    }

    // ── Tasks ────────────────────────────────────────────

    @GetMapping("/tasks")
    public ResponseEntity<List<Task>> getMyTasks(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.getMyTasks(resolveUser(principal)));
    }

    @PatchMapping("/tasks/{id}")
    public ResponseEntity<Task> updateTaskStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(
            employeeService.updateTaskStatus(id, body.get("status"), resolveUser(principal))
        );
    }

    // ── Messages/Inbox ───────────────────────────────────

    @GetMapping("/messages")
    public ResponseEntity<List<Message>> getMessages(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(employeeService.getMyMessages(resolveUser(principal)));
    }

    @GetMapping("/messages/unread-count")
    public ResponseEntity<Map<String, Long>> getUnreadCount(
            @AuthenticationPrincipal UserPrincipal principal) {
        long count = employeeService.getUnreadCount(resolveUser(principal));
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/messages/{id}/read")
    public ResponseEntity<Void> markRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        employeeService.markRead(id, resolveUser(principal));
        return ResponseEntity.noContent().build();
    }
}
