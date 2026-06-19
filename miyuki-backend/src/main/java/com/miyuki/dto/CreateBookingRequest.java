package com.miyuki.dto;

import java.util.List;

public class CreateBookingRequest {
    private Long userId;
    private Long tripId;
    private List<Long> seatIds;

    public CreateBookingRequest() {}

    public CreateBookingRequest(Long userId, Long tripId, List<Long> seatIds) {
        this.userId = userId;
        this.tripId = tripId;
        this.seatIds = seatIds;
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Long getTripId() { return tripId; }
    public void setTripId(Long tripId) { this.tripId = tripId; }

    public List<Long> getSeatIds() { return seatIds; }
    public void setSeatIds(List<Long> seatIds) { this.seatIds = seatIds; }

    public static CreateBookingRequestBuilder builder() {
        return new CreateBookingRequestBuilder();
    }

    public static class CreateBookingRequestBuilder {
        private Long userId;
        private Long tripId;
        private List<Long> seatIds;

        public CreateBookingRequestBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public CreateBookingRequestBuilder tripId(Long tripId) {
            this.tripId = tripId;
            return this;
        }

        public CreateBookingRequestBuilder seatIds(List<Long> seatIds) {
            this.seatIds = seatIds;
            return this;
        }

        public CreateBookingRequest build() {
            return new CreateBookingRequest(userId, tripId, seatIds);
        }
    }
}
