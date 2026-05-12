package com.sentinel.repositories;

import com.sentinel.models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

// ── User Repository ──────────────────────────────────────
@Repository
interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    Optional<User> findByProviderAndProviderId(User.AuthProvider provider, String providerId);
}

// ── Shift Repository ─────────────────────────────────────
@Repository
interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByUserOrderByDateAscStartTimeAsc(User user);
    List<Shift> findByDateBetweenOrderByDateAscStartTimeAsc(LocalDate from, LocalDate to);
    List<Shift> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

    @Query("SELECT s FROM Shift s WHERE s.user.id = :userId AND s.date >= :today ORDER BY s.date, s.startTime")
    List<Shift> findUpcomingByUser(Long userId, LocalDate today);
}

// ── Task Repository ──────────────────────────────────────
@Repository
interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToOrderByPriorityDescDueDateAsc(User user);
    List<Task> findByStatusOrderByPriorityDesc(Task.TaskStatus status);
    List<Task> findAllByOrderByPriorityDescCreatedAtDesc();
}

// ── TimeLog Repository ───────────────────────────────────
@Repository
interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByUserOrderByDateDesc(User user);
    Optional<TimeLog> findByUserAndClockOutIsNull(User user);
    List<TimeLog> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(t.totalMinutes), 0) FROM TimeLog t WHERE t.user = :user AND t.date = :date")
    Long sumMinutesToday(User user, LocalDate date);
}

// ── Message Repository ───────────────────────────────────
@Repository
interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrIsBroadcastTrueOrderByTimestampDesc(User recipient);
    long countByRecipientAndIsReadFalse(User recipient);

    @Query("SELECT m FROM Message m WHERE (m.recipient = :user OR m.isBroadcast = true) ORDER BY m.timestamp DESC")
    List<Message> findAllForUser(User user);
}

// ── SensorNode Repository ─────────────────────────────────
@Repository
interface SensorNodeRepository extends JpaRepository<SensorNode, String> {
    List<SensorNode> findByStatus(SensorNode.NodeStatus status);
    long countByStatus(SensorNode.NodeStatus status);
}
