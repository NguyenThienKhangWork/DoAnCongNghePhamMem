package com.miyuki.repository;

import com.miyuki.entity.Booking;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUser_UserId(Long userId);
    Optional<Booking> findByBookingCode(String bookingCode);

    Page<Booking> findByBookingStatus(Booking.BookingStatus bookingStatus, Pageable pageable);

    @Query("SELECT SUM(b.totalPrice) FROM Booking b WHERE b.paymentStatus = 'PAID'")
    BigDecimal sumPaidRevenue();

    @Query("SELECT COUNT(b) FROM Booking b WHERE DATE(b.createdAt) = CURRENT_DATE")
    Long countTodayBookings();
}
