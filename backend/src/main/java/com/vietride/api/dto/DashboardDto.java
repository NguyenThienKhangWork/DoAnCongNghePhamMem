package com.vietride.api.dto;

public record DashboardDto(
        long ticketsToday,
        long activeBuses,
        long onlineUsers,
        long aiRecommendations,
        double satisfaction
) {
}
