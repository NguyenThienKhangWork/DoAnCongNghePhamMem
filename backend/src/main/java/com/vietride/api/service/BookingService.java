package com.vietride.api.service;

import com.vietride.api.dto.BookingDto;
import com.vietride.api.dto.CreateBookingRequest;
import com.vietride.api.model.Booking;
import com.vietride.api.model.Trip;
import com.vietride.api.repository.BookingRepository;
import com.vietride.api.repository.TripRepository;
import jakarta.transaction.Transactional;
import java.math.BigDecimal;
import java.util.UUID;
import org.springframework.stereotype.Service;

@Service
public class BookingService {
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final TripMapper mapper;

    public BookingService(TripRepository tripRepository, BookingRepository bookingRepository, TripMapper mapper) {
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
        this.mapper = mapper;
    }

    @Transactional
    public BookingDto create(CreateBookingRequest request) {
        Trip trip = tripRepository.findById(request.tripId())
                .orElseThrow(() -> new IllegalArgumentException("Trip not found"));
        trip.reserveSeats(request.seatCount());
        BigDecimal totalPrice = trip.getPrice().multiply(BigDecimal.valueOf(request.seatCount()));
        Booking booking = new Booking(
                trip,
                request.passengerName(),
                request.passengerPhone(),
                request.passengerEmail(),
                request.seatCount(),
                request.seats(),
                totalPrice,
                generateCode()
        );
        return mapper.toBookingDto(bookingRepository.save(booking));
    }

    @Transactional
    public BookingDto pay(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
        booking.pay();
        return mapper.toBookingDto(bookingRepository.save(booking));
    }

    public java.util.List<BookingDto> lookup(String searchVal) {
        return bookingRepository.findByPassengerPhoneContainingOrBookingCodeContainingIgnoreCase(searchVal, searchVal)
                .stream()
                .map(mapper::toBookingDto)
                .toList();
    }

    private String generateCode() {
        return "VRX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}
