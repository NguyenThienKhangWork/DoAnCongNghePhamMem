package com.miyuki.repository;

import com.miyuki.entity.Seat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {
    List<Seat> findByTrip_TripId(Long tripId);
    List<Seat> findByTrip_TripIdAndIsAvailable(Long tripId, Boolean isAvailable);
    List<Seat> findByBooking_BookingId(Long bookingId);
}
