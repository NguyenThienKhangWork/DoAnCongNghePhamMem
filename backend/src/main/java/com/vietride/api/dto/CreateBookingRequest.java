package com.vietride.api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateBookingRequest(
        @NotNull Long tripId,
        @NotBlank String passengerName,
        @NotBlank String passengerPhone,
        @Email String passengerEmail,
        @Min(1) @Max(8) int seatCount,
        String seats
) {
}
