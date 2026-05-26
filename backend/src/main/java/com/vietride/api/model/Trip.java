package com.vietride.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "trips")
public class Trip {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private BusRoute route;

    @ManyToOne(fetch = FetchType.LAZY)
    private BusOperator operator;

    private LocalDateTime departureTime;
    private LocalDateTime arrivalTime;
    private BigDecimal price;
    private int totalSeats;
    private int bookedSeats;

    protected Trip() {
    }

    public Trip(BusRoute route, BusOperator operator, LocalDateTime departureTime, LocalDateTime arrivalTime,
                BigDecimal price, int totalSeats, int bookedSeats) {
        this.route = route;
        this.operator = operator;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.price = price;
        this.totalSeats = totalSeats;
        this.bookedSeats = bookedSeats;
    }

    public Long getId() {
        return id;
    }

    public BusRoute getRoute() {
        return route;
    }

    public BusOperator getOperator() {
        return operator;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public LocalDateTime getArrivalTime() {
        return arrivalTime;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getBookedSeats() {
        return bookedSeats;
    }

    public int getAvailableSeats() {
        return totalSeats - bookedSeats;
    }

    public void reserveSeats(int seats) {
        if (seats <= 0) {
            throw new IllegalArgumentException("Seat count must be greater than zero");
        }
        if (bookedSeats + seats > totalSeats) {
            throw new IllegalStateException("Not enough available seats");
        }
        bookedSeats += seats;
    }
}
