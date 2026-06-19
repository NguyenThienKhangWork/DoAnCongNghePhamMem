package com.miyuki.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bus_companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusCompany {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long companyId;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    private String address;

    @Column(unique = true)
    private String taxNumber;

    @Column(unique = true)
    private String licenseNumber;

    private String bankAccount;

    private String bankName;

    @Column(precision = 3, scale = 2)
    private BigDecimal rating = BigDecimal.valueOf(5.00);

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(20) DEFAULT 'ACTIVE'")
    private CompanyStatus status = CompanyStatus.ACTIVE;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum CompanyStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
