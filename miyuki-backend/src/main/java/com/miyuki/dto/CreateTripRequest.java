package com.miyuki.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class CreateTripRequest {
    private Long routeId;
    private Long busId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;

    public CreateTripRequest() {}
    public CreateTripRequest(Long routeId, Long busId, LocalDateTime departureTime,
                            LocalDateTime arrivalTime, BigDecimal price) {
        this.routeId = routeId;
        this.busId = busId;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
    }

    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }

    public Long getBusId() { return busId; }
    public void setBusId(Long busId) { this.busId = busId; }

    public LocalDateTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalDateTime departureTime) { this.departureTime = departureTime; }

    public LocalDateTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalDateTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
