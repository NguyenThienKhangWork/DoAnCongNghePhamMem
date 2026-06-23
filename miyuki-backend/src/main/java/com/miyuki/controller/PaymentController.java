package com.miyuki.controller;

import com.miyuki.dto.CreatePaymentRequest;
import com.miyuki.dto.RefundRequest;
import com.miyuki.entity.Payment;
import com.miyuki.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<Payment> createPayment(@RequestBody CreatePaymentRequest request) {
        Payment payment = paymentService.createPayment(
            request.getBookingId(),
            request.getPaymentMethod()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(payment);
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<Payment> getPayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.getPaymentById(paymentId);
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{paymentId}/complete")
    public ResponseEntity<Payment> completePayment(@PathVariable Long paymentId) {
        Payment payment = paymentService.updatePaymentStatus(
            paymentId,
            Payment.PaymentStatus.COMPLETED
        );
        return ResponseEntity.ok(payment);
    }

    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<Void> refundPayment(
        @PathVariable Long paymentId,
        @RequestBody RefundRequest request
    ) {
        paymentService.processRefund(paymentId, request.getRefundAmount());
        return ResponseEntity.ok().build();
    }
}
