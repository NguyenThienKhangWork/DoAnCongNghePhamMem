package com.miyuki.controller;

import com.miyuki.entity.Refund;
import com.miyuki.service.RefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/refunds")
@RequiredArgsConstructor
public class RefundController {
    private final RefundService refundService;

    @PostMapping
    public ResponseEntity<Refund> requestRefund(@RequestBody Map<String, Object> body) {
        Long userId = Long.valueOf(body.get("userId").toString());
        Long bookingId = Long.valueOf(body.get("bookingId").toString());
        String reason = (String) body.getOrDefault("reason", "");
        Refund refund = refundService.createRefundRequest(userId, bookingId, reason);
        return ResponseEntity.ok(refund);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Refund>> getMyRefunds(@RequestParam Long userId) {
        return ResponseEntity.ok(refundService.getUserRefunds(userId));
    }
}