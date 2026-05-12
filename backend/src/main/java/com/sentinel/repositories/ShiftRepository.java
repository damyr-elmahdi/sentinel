package com.sentinel.repositories;

import com.sentinel.models.Shift;
import com.sentinel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShiftRepository extends JpaRepository<Shift, Long> {
    List<Shift> findByUserOrderByDateAscStartTimeAsc(User user);
    List<Shift> findByDateBetweenOrderByDateAscStartTimeAsc(LocalDate from, LocalDate to);
    List<Shift> findByUserAndDateBetween(User user, LocalDate from, LocalDate to);

    @Query("SELECT s FROM Shift s WHERE s.user.id = :userId AND s.date >= :today ORDER BY s.date, s.startTime")
    List<Shift> findUpcomingByUser(Long userId, LocalDate today);
}
