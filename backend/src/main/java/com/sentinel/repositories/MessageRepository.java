package com.sentinel.repositories;

import com.sentinel.models.Message;
import com.sentinel.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByRecipientOrIsBroadcastTrueOrderByTimestampDesc(User recipient);
    long countByRecipientAndIsReadFalse(User recipient);

    @Query("SELECT m FROM Message m WHERE (m.recipient = :user OR m.isBroadcast = true) ORDER BY m.timestamp DESC")
    List<Message> findAllForUser(User user);
}
