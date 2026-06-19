package com.miyuki.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundResponse {
    private Boolean success;
    private String message;
}
