package com.sentinel.services;

import com.sentinel.models.*;
import com.sentinel.repositories.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final ShiftRepository shiftRepository;
    private final TaskRepository taskRepository;
    private final MessageRepository messageRepository;
    private final SensorNodeRepository sensorNodeRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Sensor Network ───────────────────────────────────

    public List<SensorNode> getAllSensors() {
        return sensorNodeRepository.findAll();
    }

    public SensorNode getSensor(String id) {
        return sensorNodeRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Sensor not found: " + id));
    }

    // ── Employee Management ──────────────────────────────

    public List<User> getAllEmployees() {
        return userRepository.findAll();
    }

    @Transactional
    public User createEmployee(String fullName, String email,
                               String username, String department,
                               String password, User.Role role) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use.");
        }
        User user = User.builder()
            .fullName(fullName)
            .email(email)
            .username(username)
            .password(passwordEncoder.encode(password))
            .role(role != null ? role : User.Role.EMPLOYEE)
            .provider(User.AuthProvider.LOCAL)
            .build();
        return userRepository.save(user);
    }

    @Transactional
    public User updateEmployee(Long id, String fullName, String email, User.Role role, boolean enabled) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Employee not found: " + id));
        user.setFullName(fullName);
        user.setEmail(email);
        user.setRole(role);
        user.setEnabled(enabled);
        return userRepository.save(user);
    }

    @Transactional
    public void deleteEmployee(Long id) {
        userRepository.deleteById(id);
    }

    // ── Task Oversight ───────────────────────────────────

    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByPriorityDescCreatedAtDesc();
    }

    @Transactional
    public Task createTask(String title, String description,
                           Task.Priority priority, Long assignedToId,
                           LocalDateTime dueDate, User createdBy) {
        User assignee = assignedToId != null
            ? userRepository.findById(assignedToId).orElse(null)
            : null;

        Task task = Task.builder()
            .title(title)
            .description(description)
            .priority(priority)
            .assignedTo(assignee)
            .createdBy(createdBy)
            .dueDate(dueDate)
            .status(Task.TaskStatus.PENDING)
            .build();
        return taskRepository.save(task);
    }

    @Transactional
    public Task updateTask(Long id, String title, String description,
                           Task.Priority priority, Task.TaskStatus status,
                           Long assignedToId, LocalDateTime dueDate) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Task not found: " + id));
        task.setTitle(title);
        task.setDescription(description);
        task.setPriority(priority);
        task.setStatus(status);
        task.setDueDate(dueDate);
        if (assignedToId != null) {
            userRepository.findById(assignedToId).ifPresent(task::setAssignedTo);
        } else {
            task.setAssignedTo(null);
        }
        return taskRepository.save(task);
    }

    @Transactional
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }

    // ── Schedule Management ──────────────────────────────

    public List<Shift> getAllShifts() {
        LocalDate from = LocalDate.now().minusMonths(1);
        LocalDate to = LocalDate.now().plusMonths(2);
        return shiftRepository.findByDateBetweenOrderByDateAscStartTimeAsc(from, to);
    }

    @Transactional
    public Shift createShift(Long userId, LocalDate date,
                             LocalTime start, LocalTime end,
                             String location, String notes) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Shift shift = Shift.builder()
            .user(user).date(date)
            .startTime(start).endTime(end)
            .location(location).notes(notes)
            .status(Shift.ShiftStatus.SCHEDULED)
            .build();
        return shiftRepository.save(shift);
    }

    @Transactional
    public Shift updateShift(Long id, LocalDate date,
                             LocalTime start, LocalTime end,
                             String location, Shift.ShiftStatus status) {
        Shift shift = shiftRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Shift not found: " + id));
        shift.setDate(date);
        shift.setStartTime(start);
        shift.setEndTime(end);
        shift.setLocation(location);
        shift.setStatus(status);
        return shiftRepository.save(shift);
    }

    @Transactional
    public void deleteShift(Long id) {
        shiftRepository.deleteById(id);
    }

    // ── Broadcast ────────────────────────────────────────

    @Transactional
    public void broadcastMessage(String subject, String body,
                                 Message.MessageType type, User sender,
                                 Long recipientId) {
        if (recipientId != null) {
            // Targeted message
            User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new RuntimeException("Recipient not found"));
            Message msg = Message.builder()
                .subject(subject).body(body).type(type)
                .sender(sender).recipient(recipient)
                .isBroadcast(false).build();
            messageRepository.save(msg);
        } else {
            // Broadcast to all employees
            List<User> employees = userRepository.findAll().stream()
                .filter(u -> u.getRole() == User.Role.EMPLOYEE && u.isEnabled())
                .toList();

            for (User emp : employees) {
                Message msg = Message.builder()
                    .subject(subject).body(body).type(type)
                    .sender(sender).recipient(emp)
                    .isBroadcast(true).build();
                messageRepository.save(msg);
            }
        }
    }
}
