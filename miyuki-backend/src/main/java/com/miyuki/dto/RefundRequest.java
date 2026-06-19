package com.miyuki.dto;

import java.math.BigDecimal;

public class RefundRequest {
    private BigDecimal refundAmount;

    public RefundRequest() {}
    public RefundRequest(BigDecimal refundAmount) {
        this.refundAmount = refundAmount;
    }

    public BigDecimal getRefundAmount() { return refundAmount; }
    public void setRefundAmount(BigDecimal refundAmount) { this.refundAmount = refundAmount; }
}
