package com.miyuki.repository;

import com.miyuki.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    Page<Notification> findAll(Pageable pageable);
    List<Notification> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    long countByUser_UserIdAndIsRead(Long userId, Boolean isRead);
}
