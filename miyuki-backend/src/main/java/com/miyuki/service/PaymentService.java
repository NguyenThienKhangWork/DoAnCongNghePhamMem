package com.miyuki.service;

import com.miyuki.entity.Payment;
import com.miyuki.entity.Booking;
import com.miyuki.repository.PaymentRepository;
import com.miyuki.repository.BookingRepository;
import com.miyuki.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PaymentService {
    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public Payment createPayment(Long bookingId, String paymentMethod) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Vé không tồn tại"));

        Payment payment = Payment.builder()
            .booking(booking)
            .amount(booking.getTotalPrice())
            .paymentMethod(paymentMethod)
            .paymentStatus(Payment.PaymentStatus.PENDING)
            .build();

        return paymentRepository.save(payment);
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
            .orElseThrow(() -> new ResourceNotFoundException("Thanh toán không tồn tại"));
    }

    public Payment updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        Payment payment = getPaymentById(paymentId);
        payment.setPaymentStatus(status);
        
        if (status == Payment.PaymentStatus.COMPLETED) {
            payment.setPaymentDate(LocalDateTime.now());
            Booking booking = payment.getBooking();
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);
        }
        
        return paymentRepository.save(payment);
    }

    public void processRefund(Long paymentId, BigDecimal refundAmount) {
        Payment payment = getPaymentById(paymentId);
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.setRefundDate(LocalDateTime.now());
        paymentRepository.save(payment);
    }
}
