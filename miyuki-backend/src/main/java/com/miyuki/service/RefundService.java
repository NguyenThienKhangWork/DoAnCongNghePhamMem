package com.miyuki.service;

import com.miyuki.entity.Booking;
import com.miyuki.entity.Payment;
import com.miyuki.entity.Refund;
import com.miyuki.entity.User;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BookingRepository;
import com.miyuki.repository.PaymentRepository;
import com.miyuki.repository.RefundRepository;
import com.miyuki.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RefundService {
    private final RefundRepository refundRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    @Transactional
    public Refund createRefundRequest(Long userId, Long bookingId, String reason) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));

        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Vé không tồn tại"));

        if (!booking.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền yêu cầu hoàn tiền cho vé này");
        }

        if (booking.getBookingStatus() != Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Chỉ có thể yêu cầu hoàn tiền cho vé đã hủy");
        }

        if (refundRepository.findByBooking_BookingId(bookingId).isPresent()) {
            throw new RuntimeException("Vé này đã có yêu cầu hoàn tiền");
        }

        Payment payment = paymentRepository.findByBooking_BookingId(bookingId)
            .orElse(null);

        if (payment == null || payment.getPaymentStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new RuntimeException("Vé chưa được thanh toán nên không thể hoàn tiền");
        }

        Refund refund = Refund.builder()
            .booking(booking)
            .payment(payment)
            .refundAmount(booking.getTotalPrice())
            .refundReason(reason)
            .refundStatus(Refund.RefundStatus.PENDING)
            .build();

        return refundRepository.save(refund);
    }

    public List<Refund> getUserRefunds(Long userId) {
        return refundRepository.findByBooking_User_UserIdOrderByCreatedAtDesc(userId);
    }
}