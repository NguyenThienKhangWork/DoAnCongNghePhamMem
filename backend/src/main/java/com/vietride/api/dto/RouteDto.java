package com.vietride.api.dto;

public record RouteDto(
        Long id,
        String origin,
        String destination,
        int distanceKm,
        int durationMinutes,
        String badge,
        int minPrice,
        int availableSeats
) {
}
