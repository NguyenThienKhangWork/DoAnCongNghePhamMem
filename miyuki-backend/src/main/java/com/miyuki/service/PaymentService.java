package com.miyuki.service;

import com.miyuki.entity.Booking;
import com.miyuki.entity.Payment;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BookingRepository;
import com.miyuki.repository.PaymentRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final VNPayService vnPayService;

    // ─── Tạo payment record + sinh URL VNPay ────────────────────────────────

    @Transactional
    public Payment createPendingPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Vé không tồn tại"));

        // Nếu đã có payment PENDING thì dùng lại, tránh tạo duplicate
        return paymentRepository.findByBooking_BookingIdAndPaymentStatus(
                        bookingId, Payment.PaymentStatus.PENDING)
                .orElseGet(() -> paymentRepository.save(
                        Payment.builder()
                                .booking(booking)
                                .amount(booking.getTotalPrice())
                                .paymentMethod("VNPAY")
                                .paymentStatus(Payment.PaymentStatus.PENDING)
                                .build()
                ));
    }

    public String buildVNPayUrl(Payment payment, HttpServletRequest request) {
        String clientIp = getClientIp(request);
        String orderInfo = "MiYuki-" + payment.getBooking().getBookingCode();
        return vnPayService.createPaymentUrl(
                payment.getPaymentId(),
                payment.getAmount(),
                orderInfo,
                clientIp
        );
    }

    // ─── Xử lý kết quả VNPay trả về (return URL hoặc IPN) ──────────────────

    @Transactional
    public Payment handleVNPayReturn(Map<String, String> params) {
        if (!vnPayService.verifySignature(params)) {
            throw new SecurityException("Chữ ký VNPay không hợp lệ");
        }

        String txnRef    = params.get("vnp_TxnRef");
        String responseCode = params.get("vnp_ResponseCode");
        String transactionId = params.get("vnp_TransactionNo");

        // TxnRef của mình = "MK{paymentId}_{ts}" — tái dụng extractBookingId để lấy paymentId
        Long paymentId = vnPayService.extractBookingId(txnRef);
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment không tồn tại: " + paymentId));

        // Chỉ xử lý nếu còn PENDING (tránh xử lý duplicate IPN)
        if (payment.getPaymentStatus() != Payment.PaymentStatus.PENDING) {
            log.info("Payment {} đã được xử lý rồi, bỏ qua", paymentId);
            return payment;
        }

        payment.setTransactionId(transactionId);

        if ("00".equals(responseCode)) {
            // Thanh toán thành công
            payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
            payment.setPaymentDate(LocalDateTime.now());

            Booking booking = payment.getBooking();
            booking.setPaymentStatus(Booking.PaymentStatus.PAID);
            booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
            bookingRepository.save(booking);

            log.info("Thanh toán thành công: paymentId={}, bookingCode={}, transactionId={}",
                    paymentId, booking.getBookingCode(), transactionId);
        } else {
            // Thanh toán thất bại
            payment.setPaymentStatus(Payment.PaymentStatus.FAILED);
            payment.setNotes("VNPay response code: " + responseCode);
            log.warn("Thanh toán thất bại: paymentId={}, responseCode={}", paymentId, responseCode);
        }

        return paymentRepository.save(payment);
    }

    // ─── Các method cũ giữ nguyên ───────────────────────────────────────────

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

    @Transactional
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

    @Transactional
    public void processRefund(Long paymentId, BigDecimal refundAmount) {
        Payment payment = getPaymentById(paymentId);
        payment.setPaymentStatus(Payment.PaymentStatus.REFUNDED);
        payment.setRefundDate(LocalDateTime.now());
        paymentRepository.save(payment);
    }

    // ─── Helper ─────────────────────────────────────────────────────────────

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("Proxy-Client-IP");
        }
        if (ip == null || ip.isBlank() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        // Nếu có nhiều IP (proxy chain) thì lấy cái đầu tiên
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip != null ? ip : "127.0.0.1";
    }
}
