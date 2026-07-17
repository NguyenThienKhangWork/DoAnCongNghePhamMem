package com.miyuki.service;

import com.miyuki.config.VNPayConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class VNPayService {

    private final VNPayConfig vnPayConfig;

    /**
     * Tạo URL thanh toán VNPay
     *
     * @param bookingId  ID đơn đặt vé
     * @param amount     Số tiền (VND)
     * @param orderInfo  Mô tả đơn hàng
     * @param clientIp   IP của người dùng
     * @return URL redirect sang VNPay
     */
    public String createPaymentUrl(Long bookingId, BigDecimal amount, String orderInfo, String clientIp) {
        String vnpTxnRef = buildTxnRef(bookingId);
        String vnpCreateDate = getCurrentDate("yyyyMMddHHmmss");
        String vnpExpireDate = getExpireDate("yyyyMMddHHmmss", 15);

        // VNPay yêu cầu số tiền * 100 (đơn vị: đồng → thành xu)
        long vnpAmount = amount.multiply(BigDecimal.valueOf(100)).longValue();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version",     vnPayConfig.getVersion());
        params.put("vnp_Command",     vnPayConfig.getCommand());
        params.put("vnp_TmnCode",     vnPayConfig.getTmnCode());
        params.put("vnp_Amount",      String.valueOf(vnpAmount));
        params.put("vnp_CurrCode",    "VND");
        params.put("vnp_TxnRef",      vnpTxnRef);
        params.put("vnp_OrderInfo",   orderInfo);
        params.put("vnp_OrderType",   vnPayConfig.getOrderType());
        params.put("vnp_Locale",      "vn");
        params.put("vnp_ReturnUrl",   vnPayConfig.getReturnUrl());
        params.put("vnp_IpAddr",      clientIp);
        params.put("vnp_CreateDate",  vnpCreateDate);
        params.put("vnp_ExpireDate",  vnpExpireDate);

        String queryString = buildQueryString(params);
        String secureHash = hmacSHA512(vnPayConfig.getHashSecret(), queryString);

        return vnPayConfig.getPaymentUrl() + "?" + queryString + "&vnp_SecureHash=" + secureHash;
    }

    /**
     * Xác thực chữ ký từ VNPay trả về (return URL hoặc IPN)
     *
     * @param params Tất cả query params từ VNPay
     * @return true nếu chữ ký hợp lệ
     */
    public boolean verifySignature(Map<String, String> params) {
        String receivedHash = params.get("vnp_SecureHash");
        if (receivedHash == null || receivedHash.isBlank()) {
            return false;
        }

        // Loại bỏ các field chữ ký trước khi tính lại
        Map<String, String> filteredParams = new TreeMap<>(params);
        filteredParams.remove("vnp_SecureHash");
        filteredParams.remove("vnp_SecureHashType");

        String queryString = buildQueryString(filteredParams);
        String expectedHash = hmacSHA512(vnPayConfig.getHashSecret(), queryString);

        return expectedHash.equalsIgnoreCase(receivedHash);
    }

    /**
     * Lấy bookingId từ vnp_TxnRef (format: MK<bookingId>_<timestamp>)
     */
    public Long extractBookingId(String txnRef) {
        try {
            // TxnRef format: MK{bookingId}_{timestamp}
            String withoutPrefix = txnRef.substring(2); // bỏ "MK"
            String bookingIdStr = withoutPrefix.split("_")[0];
            return Long.parseLong(bookingIdStr);
        } catch (Exception e) {
            log.error("Không thể parse bookingId từ txnRef: {}", txnRef, e);
            throw new IllegalArgumentException("TxnRef không hợp lệ: " + txnRef);
        }
    }

    // ─── Private helpers ────────────────────────────────────────────────────

    private String buildTxnRef(Long bookingId) {
        // VNPay giới hạn TxnRef tối đa 100 ký tự, chỉ alphanumeric
        return "MK" + bookingId + "_" + System.currentTimeMillis();
    }

    private String buildQueryString(Map<String, String> params) {
        StringBuilder sb = new StringBuilder();
        for (Map.Entry<String, String> entry : params.entrySet()) {
            if (entry.getValue() != null && !entry.getValue().isBlank()) {
                if (sb.length() > 0) sb.append("&");
                sb.append(URLEncoder.encode(entry.getKey(), StandardCharsets.US_ASCII));
                sb.append("=");
                sb.append(URLEncoder.encode(entry.getValue(), StandardCharsets.US_ASCII));
            }
        }
        return sb.toString();
    }

    private String hmacSHA512(String key, String data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA512");
            SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            mac.init(secretKey);
            byte[] hash = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi tạo HMAC SHA512", e);
        }
    }

    private String getCurrentDate(String pattern) {
        SimpleDateFormat fmt = new SimpleDateFormat(pattern);
        fmt.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        return fmt.format(new Date());
    }

    private String getExpireDate(String pattern, int minutesFromNow) {
        SimpleDateFormat fmt = new SimpleDateFormat(pattern);
        fmt.setTimeZone(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Asia/Ho_Chi_Minh"));
        cal.add(Calendar.MINUTE, minutesFromNow);
        return fmt.format(cal.getTime());
    }
}
