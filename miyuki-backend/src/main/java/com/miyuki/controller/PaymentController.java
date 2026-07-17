package com.miyuki.controller;

import com.miyuki.dto.CreatePaymentRequest;
import com.miyuki.dto.CreateVNPayRequest;
import com.miyuki.dto.RefundRequest;
import com.miyuki.dto.VNPayResponse;
import com.miyuki.entity.Payment;
import com.miyuki.service.PaymentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @Value("${vnpay.return-url:http://localhost:8080/api/v1/payments/vnpay/return}")
    private String vnpayReturnUrl;

    // ─── VNPay endpoints ────────────────────────────────────────────────────

    /**
     * Bước 1: Frontend gọi để lấy URL redirect sang VNPay
     * POST /payments/vnpay/create
     */
    @PostMapping("/vnpay/create")
    public ResponseEntity<VNPayResponse> createVNPayPayment(
            @RequestBody CreateVNPayRequest request,
            HttpServletRequest httpRequest) {

        Payment payment = paymentService.createPendingPayment(request.getBookingId());
        String paymentUrl = paymentService.buildVNPayUrl(payment, httpRequest);

        return ResponseEntity.ok(VNPayResponse.builder()
                .paymentUrl(paymentUrl)
                .paymentId(payment.getPaymentId())
                .bookingCode(payment.getBooking().getBookingCode())
                .build());
    }

    /**
     * Bước 2a: VNPay redirect trình duyệt về đây sau khi user thanh toán.
     * Backend xác thực → redirect về frontend kèm kết quả.
     * GET /payments/vnpay/return
     */
    @GetMapping("/vnpay/return")
    public void vnpayReturn(
            @RequestParam Map<String, String> params,
            HttpServletResponse response) throws IOException {

        String frontendBase = "http://localhost:5173/payment-result";
        try {
            Payment payment = paymentService.handleVNPayReturn(params);
            String status = payment.getPaymentStatus() == Payment.PaymentStatus.COMPLETED
                    ? "success" : "failed";
            String bookingCode = payment.getBooking().getBookingCode();
            response.sendRedirect(frontendBase
                    + "?status=" + status
                    + "&bookingCode=" + bookingCode
                    + "&amount=" + payment.getAmount()
                    + "&transactionId=" + (payment.getTransactionId() != null ? payment.getTransactionId() : ""));
        } catch (SecurityException e) {
            log.error("VNPay return - chữ ký không hợp lệ: {}", e.getMessage());
            response.sendRedirect(frontendBase + "?status=invalid");
        } catch (Exception e) {
            log.error("VNPay return - lỗi: {}", e.getMessage(), e);
            response.sendRedirect(frontendBase + "?status=error");
        }
    }

    /**
     * Bước 2b: VNPay gọi IPN (server-to-server) để confirm kết quả.
     * Phải trả về {"RspCode":"00","Message":"Confirm Success"} nếu OK.
     * GET /payments/vnpay/ipn
     */
    @GetMapping("/vnpay/ipn")
    public ResponseEntity<Map<String, String>> vnpayIpn(
            @RequestParam Map<String, String> params) {

        Map<String, String> result = new HashMap<>();
        try {
            paymentService.handleVNPayReturn(params);
            result.put("RspCode", "00");
            result.put("Message", "Confirm Success");
        } catch (SecurityException e) {
            log.error("VNPay IPN - chữ ký không hợp lệ");
            result.put("RspCode", "97");
            result.put("Message", "Invalid Signature");
        } catch (Exception e) {
            log.error("VNPay IPN - lỗi xử lý: {}", e.getMessage());
            result.put("RspCode", "99");
            result.put("Message", "Unknown error");
        }
        return ResponseEntity.ok(result);
    }

    // ─── Các endpoint cũ giữ nguyên ─────────────────────────────────────────

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
        return ResponseEntity.ok(paymentService.getPaymentById(paymentId));
    }

    @PutMapping("/{paymentId}/complete")
    public ResponseEntity<Payment> completePayment(@PathVariable Long paymentId) {
        return ResponseEntity.ok(
                paymentService.updatePaymentStatus(paymentId, Payment.PaymentStatus.COMPLETED));
    }

    @PutMapping("/{paymentId}/refund")
    public ResponseEntity<Void> refundPayment(
            @PathVariable Long paymentId,
            @RequestBody RefundRequest request) {
        paymentService.processRefund(paymentId, request.getRefundAmount());
        return ResponseEntity.ok().build();
    }
}
