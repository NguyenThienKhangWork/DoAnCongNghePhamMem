package com.miyuki.service;

import com.miyuki.entity.Booking;
import com.miyuki.entity.Seat;
import com.miyuki.entity.Trip;
import com.miyuki.entity.User;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BookingRepository;
import com.miyuki.repository.SeatRepository;
import com.miyuki.repository.TripRepository;
import com.miyuki.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final TripRepository tripRepository;
    private final SeatRepository seatRepository;
    private final UserRepository userRepository;

    @Transactional
    public Booking createBooking(Long userId, Long tripId, List<Long> seatIds) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Trip trip = tripRepository.findById(tripId)
            .orElseThrow(() -> new ResourceNotFoundException("Chuyến đi không tồn tại"));

        if (trip.getAvailableSeats() < seatIds.size()) {
            throw new RuntimeException("Không đủ ghế trống");
        }

        // Kiểm tra tất cả ghế còn trống trước khi đặt
        List<Seat> seats = seatIds.stream()
            .map(id -> seatRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ghế không tồn tại: " + id)))
            .toList();

        for (Seat seat : seats) {
            if (!Boolean.TRUE.equals(seat.getIsAvailable())) {
                throw new RuntimeException("Ghế " + seat.getSeatNumber() + " đã được đặt");
            }
        }

        BigDecimal totalPrice = trip.getPrice().multiply(BigDecimal.valueOf(seatIds.size()));

        Booking booking = Booking.builder()
            .user(user)
            .trip(trip)
            .bookingCode(generateBookingCode())
            .totalPrice(totalPrice)
            .departureDate(trip.getDepartureTime().toLocalDate())
            .bookingStatus(Booking.BookingStatus.PENDING)
            .paymentStatus(Booking.PaymentStatus.UNPAID)
            .build();

        Booking savedBooking = bookingRepository.save(booking);

        // Cập nhật trạng thái ghế
        for (Seat seat : seats) {
            seat.setBooking(savedBooking);
            seat.setIsAvailable(false);
            seatRepository.save(seat);
        }

        // Giảm số ghế còn trống
        trip.setAvailableSeats(trip.getAvailableSeats() - seatIds.size());
        tripRepository.save(trip);

        return savedBooking;
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Vé không tồn tại"));
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUser_UserId(userId);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);

        if (booking.getBookingStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Vé đã được hủy trước đó");
        }

        booking.setBookingStatus(Booking.BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());

        // Trả lại ghế và cập nhật số lượng available
        List<Seat> bookedSeats = seatRepository.findByBooking_BookingId(bookingId);
        for (Seat seat : bookedSeats) {
            seat.setIsAvailable(true);
            seat.setBooking(null);
            seatRepository.save(seat);
        }

        Trip trip = booking.getTrip();
        trip.setAvailableSeats(trip.getAvailableSeats() + bookedSeats.size());
        tripRepository.save(trip);

        return bookingRepository.save(booking);
    }

    private String generateBookingCode() {
        return "MK" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
