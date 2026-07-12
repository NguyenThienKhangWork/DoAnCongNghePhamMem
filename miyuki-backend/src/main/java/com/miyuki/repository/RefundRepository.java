package com.miyuki.repository;

import com.miyuki.entity.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RefundRepository extends JpaRepository<Refund, Long> {
    Page<Refund> findAll(Pageable pageable);
    Optional<Refund> findByBooking_BookingId(Long bookingId);
    List<Refund> findByBooking_User_UserIdOrderByCreatedAtDesc(Long userId);
}
