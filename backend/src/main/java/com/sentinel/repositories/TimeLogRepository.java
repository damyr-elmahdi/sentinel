package com.sentinel.repositories;

import com.sentinel.models.TimeLog;
import com.sentinel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeLogRepository extends JpaRepository<TimeLog, Long> {
    List<TimeLog> findByUserOrderByDateDesc(User user);
    Optional<TimeLog> findByUserAndClockOutIsNull(User user);
    List<TimeLog> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

    @Query("SELECT COALESCE(SUM(t.totalMinutes), 0) FROM TimeLog t WHERE t.user = :user AND t.date = :date")
    Long sumMinutesToday(User user, LocalDate date);
}
