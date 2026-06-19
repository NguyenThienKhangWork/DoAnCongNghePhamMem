package com.miyuki.dto;

public class CreatePaymentRequest {
    private Long bookingId;
    private String paymentMethod;

    public CreatePaymentRequest() {}
    public CreatePaymentRequest(Long bookingId, String paymentMethod) {
        this.bookingId = bookingId;
        this.paymentMethod = paymentMethod;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
