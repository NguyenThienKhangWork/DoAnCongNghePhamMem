package com.vietride.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record BookingDto(
        Long id,
        String bookingCode,
        String status,
        String passengerName,
        String passengerPhone,
        String passengerEmail,
        int seatCount,
        String seats,
        BigDecimal totalPrice,
        TripDto trip,
        LocalDateTime createdAt
) {
}
