package com.vietride.api.service;

import com.vietride.api.dto.BookingDto;
import com.vietride.api.dto.TripDto;
import com.vietride.api.model.Booking;
import com.vietride.api.model.Trip;
import org.springframework.stereotype.Component;

@Component
public class TripMapper {
    public TripDto toTripDto(Trip trip) {
        return new TripDto(
                trip.getId(),
                trip.getRoute().getOrigin().getName(),
                trip.getRoute().getDestination().getName(),
                trip.getOperator().getName(),
                trip.getOperator().getRating(),
                trip.getOperator().getBusType(),
                trip.getRoute().getBadge(),
                trip.getDepartureTime(),
                trip.getArrivalTime(),
                trip.getPrice(),
                trip.getTotalSeats(),
                trip.getAvailableSeats(),
                trip.getRoute().getDurationMinutes()
        );
    }

    public BookingDto toBookingDto(Booking booking) {
        return new BookingDto(
                booking.getId(),
                booking.getBookingCode(),
                booking.getStatus(),
                booking.getPassengerName(),
                booking.getPassengerPhone(),
                booking.getPassengerEmail(),
                booking.getSeatCount(),
                booking.getSeats(),
                booking.getTotalPrice(),
                toTripDto(booking.getTrip()),
                booking.getCreatedAt()
        );
    }
}
