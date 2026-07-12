package com.miyuki.service;

import com.miyuki.entity.Booking;
import com.miyuki.entity.Payment;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BookingRepository;
import com.miyuki.repository.PaymentRepository;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class VietQRService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    @Value("${bank.bin}")
    private String bankBin;

    @Value("${bank.account-number}")
    private String accountNumber;

    @Value("${bank.account-name}")
    private String accountName;

    public Map<String, Object> generateQR(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        String transactionId = "QR" + bookingId + System.currentTimeMillis();
        long amount = booking.getTotalPrice().longValue();
        String content = "MIYUKI" + booking.getBookingCode();

        String qrContent = buildNapasQr(bankBin, accountNumber, amount, content);

        Payment payment = Payment.builder()
            .booking(booking)
            .amount(booking.getTotalPrice())
            .paymentMethod("VIETQR")
            .transactionId(transactionId)
            .paymentStatus(Payment.PaymentStatus.PENDING)
            .notes(qrContent)
            .build();
        paymentRepository.save(payment);

        return Map.of(
            "transactionId", transactionId,
            "amount", amount,
            "accountNumber", accountNumber,
            "accountName", accountName,
            "bankBin", bankBin,
            "qrContent", qrContent
        );
    }

    public Payment getPaymentByTransactionId(String transactionId) {
        return paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
    }

    @Transactional
    public void markAsPaid(String transactionId) {
        Payment payment = paymentRepository.findByTransactionId(transactionId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found"));

        if (payment.getPaymentStatus() != Payment.PaymentStatus.PENDING) {
            throw new IllegalStateException("Payment already processed");
        }

        payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
        payment.setPaymentDate(LocalDateTime.now());
        paymentRepository.save(payment);

        Booking booking = payment.getBooking();
        booking.setPaymentStatus(Booking.PaymentStatus.PAID);
        booking.setBookingStatus(Booking.BookingStatus.CONFIRMED);
        bookingRepository.save(booking);
    }

    public byte[] generateQRImage(String qrContent) {
        try {
            QRCodeWriter writer = new QRCodeWriter();
            var bitMatrix = writer.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", baos);
            return baos.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR image", e);
        }
    }

    private String buildNapasQr(String bin, String accountNo, long amount, String content) {
        String payLoad = "00020101021238" + String.format("%02d", (21 + bin.length() + accountNo.length()))
            + "0010A000000727012700069704" + String.format("%02d", bin.length())
            + "01" + bin + String.format("%02d", accountNo.length())
            + "01" + accountNo + "0208QRIBFTTA"
            + "5303704" + String.format("%02d", String.valueOf(amount).length())
            + amount + "5802VN62" + String.format("%02d", (8 + content.length()))
            + "08" + content + "6304";
        return payLoad + crc16(payLoad);
    }

    private String crc16(String data) {
        int crc = 0xFFFF;
        for (byte b : data.getBytes()) {
            crc ^= (b & 0xFF) << 8;
            for (int i = 0; i < 8; i++) {
                if ((crc & 0x8000) != 0) crc = (crc << 1) ^ 0x1021;
                else crc <<= 1;
            }
        }
        return Integer.toHexString((crc & 0xFFFF) & 0xFFFF).toUpperCase();
    }
}
