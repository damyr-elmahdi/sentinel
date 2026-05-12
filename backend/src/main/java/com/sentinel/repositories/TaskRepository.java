package com.sentinel.repositories;

import com.sentinel.models.Task;
import com.sentinel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToOrderByPriorityDescDueDateAsc(User user);
    List<Task> findByStatusOrderByPriorityDesc(Task.TaskStatus status);
    List<Task> findAllByOrderByPriorityDescCreatedAtDesc();
}
