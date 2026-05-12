package com.sentinel.services;

import com.sentinel.models.*;
import com.sentinel.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final ShiftRepository shiftRepository;
    private final TimeLogRepository timeLogRepository;
    private final TaskRepository taskRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // ── Shifts ──────────────────────────────────────────

    public List<Shift> getMyShifts(User user) {
        return shiftRepository.findByUserOrderByDateAscStartTimeAsc(user);
    }

    public List<Shift> getUpcomingShifts(User user) {
        return shiftRepository.findUpcomingByUser(user.getId(), LocalDate.now());
    }

    // ── Time Logging ────────────────────────────────────

    @Transactional
    public TimeLog clockIn(User user) {
        // Check not already clocked in
        timeLogRepository.findByUserAndClockOutIsNull(user).ifPresent(log -> {
            throw new IllegalStateException("You are already clocked in.");
        });

        TimeLog log = TimeLog.builder()
            .user(user)
            .date(LocalDate.now())
            .clockIn(LocalDateTime.now())
            .build();

        return timeLogRepository.save(log);
    }

    @Transactional
    public TimeLog clockOut(User user) {
        TimeLog log = timeLogRepository.findByUserAndClockOutIsNull(user)
            .orElseThrow(() -> new IllegalStateException("You are not clocked in."));

        LocalDateTime now = LocalDateTime.now();
        log.setClockOut(now);
        log.setTotalMinutes(ChronoUnit.MINUTES.between(log.getClockIn(), now));

        return timeLogRepository.save(log);
    }

    public List<TimeLog> getMyTimeLogs(User user) {
        return timeLogRepository.findByUserOrderByDateDesc(user);
    }

    // ── Tasks ────────────────────────────────────────────

    public List<Task> getMyTasks(User user) {
        return taskRepository.findByAssignedToOrderByPriorityDescDueDateAsc(user);
    }

    @Transactional
    public Task updateTaskStatus(Long taskId, String status, User user) {
        Task task = taskRepository.findById(taskId)
            .orElseThrow(() -> new RuntimeException("Task not found: " + taskId));

        if (task.getAssignedTo() == null || !task.getAssignedTo().getId().equals(user.getId())) {
            throw new SecurityException("You are not assigned to this task.");
        }

        task.setStatus(Task.TaskStatus.valueOf(status));
        return taskRepository.save(task);
    }

    // ── Messages ─────────────────────────────────────────

    public List<Message> getMyMessages(User user) {
        return messageRepository.findAllForUser(user);
    }

    public long getUnreadCount(User user) {
        return messageRepository.countByRecipientAndIsReadFalse(user);
    }

    @Transactional
    public void markRead(Long messageId, User user) {
        Message msg = messageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found: " + messageId));
        msg.setRead(true);
        messageRepository.save(msg);
    }
}
