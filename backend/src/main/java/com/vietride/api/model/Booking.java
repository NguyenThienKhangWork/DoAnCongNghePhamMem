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
@Table(name = "bookings")
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private Trip trip;

    private String passengerName;
    private String passengerPhone;
    private String passengerEmail;
    private int seatCount;
    private String seats;
    private BigDecimal totalPrice;
    private String status;
    private String bookingCode;
    private LocalDateTime createdAt;

    protected Booking() {
    }

    public Booking(Trip trip, String passengerName, String passengerPhone, String passengerEmail,
                   int seatCount, String seats, BigDecimal totalPrice, String bookingCode) {
        this.trip = trip;
        this.passengerName = passengerName;
        this.passengerPhone = passengerPhone;
        this.passengerEmail = passengerEmail;
        this.seatCount = seatCount;
        this.seats = seats;
        this.totalPrice = totalPrice;
        this.status = "PENDING_PAYMENT";
        this.bookingCode = bookingCode;
        this.createdAt = LocalDateTime.now();
    }

    public void pay() {
        this.status = "PAID";
    }

    public Long getId() {
        return id;
    }

    public Trip getTrip() {
        return trip;
    }

    public String getPassengerName() {
        return passengerName;
    }

    public String getPassengerPhone() {
        return passengerPhone;
    }

    public String getPassengerEmail() {
        return passengerEmail;
    }

    public int getSeatCount() {
        return seatCount;
    }

    public String getSeats() {
        return seats;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public String getStatus() {
        return status;
    }

    public String getBookingCode() {
        return bookingCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
