package com.miyuki.controller;

import com.miyuki.service.VietQRService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/payments/vietqr")
@RequiredArgsConstructor
public class VietQRController {

    private final VietQRService vietQRService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQR(@RequestParam Long bookingId) {
        try {
            Map<String, Object> result = vietQRService.generateQR(bookingId);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping(value = "/image/{transactionId}", produces = MediaType.IMAGE_PNG_VALUE)
    public ResponseEntity<byte[]> getQRImage(@PathVariable String transactionId) {
        var payment = vietQRService.getPaymentByTransactionId(transactionId);
        byte[] image = vietQRService.generateQRImage(payment.getNotes());
        return ResponseEntity.ok(image);
    }

    @PutMapping("/mark-paid/{transactionId}")
    public ResponseEntity<?> markAsPaid(@PathVariable String transactionId) {
        try {
            vietQRService.markAsPaid(transactionId);
            return ResponseEntity.ok(Map.of("success", true, "message", "Xác nhận thanh toán thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
