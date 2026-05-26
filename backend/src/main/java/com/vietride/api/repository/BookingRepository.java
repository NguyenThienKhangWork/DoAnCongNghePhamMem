package com.vietride.api.repository;

import com.vietride.api.model.Booking;
import java.time.LocalDateTime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    long countByCreatedAtAfter(LocalDateTime since);
    List<Booking> findByPassengerPhoneContainingOrBookingCodeContainingIgnoreCase(String passengerPhone, String bookingCode);
}
