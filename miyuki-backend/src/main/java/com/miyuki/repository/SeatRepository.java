package com.miyuki.repository;

import com.miyuki.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByTrip_TripId(Long tripId);
    List<Seat> findByTrip_TripIdAndIsAvailable(Long tripId, Boolean isAvailable);
    List<Seat> findByBooking_BookingId(Long bookingId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM Seat s WHERE s.seatId = :id")
    Optional<Seat> findByIdWithLock(@Param("id") Long id);
}
