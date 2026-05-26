package com.vietride.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TripDto(
        Long id,
        String origin,
        String destination,
        String operatorName,
        double operatorRating,
        String busType,
        String badge,
        LocalDateTime departureTime,
        LocalDateTime arrivalTime,
        BigDecimal price,
        int totalSeats,
        int availableSeats,
        int durationMinutes
) {
}
