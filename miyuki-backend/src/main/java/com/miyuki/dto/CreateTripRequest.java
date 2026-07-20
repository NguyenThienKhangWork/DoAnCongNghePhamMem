package com.miyuki.dto;

import java.time.LocalDateTime;
import java.math.BigDecimal;

public class CreateTripRequest {
    private Long routeId;
    private Long busId;
    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;

    // Số ghế theo từng loại — null = dùng phân bổ tự động theo loại xe
    private Integer vipSeats;
    private Integer windowSeats;
    private Integer regularSeats;

    public CreateTripRequest() {}

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

    public Integer getVipSeats() { return vipSeats; }
    public void setVipSeats(Integer vipSeats) { this.vipSeats = vipSeats; }

    public Integer getWindowSeats() { return windowSeats; }
    public void setWindowSeats(Integer windowSeats) { this.windowSeats = windowSeats; }

    public Integer getRegularSeats() { return regularSeats; }
    public void setRegularSeats(Integer regularSeats) { this.regularSeats = regularSeats; }
}
