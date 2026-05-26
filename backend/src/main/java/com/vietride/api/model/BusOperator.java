package com.vietride.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "operators")
public class BusOperator {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double rating;
    private String busType;
    private String badge;

    protected BusOperator() {
    }

    public BusOperator(String name, double rating, String busType, String badge) {
        this.name = name;
        this.rating = rating;
        this.busType = busType;
        this.badge = badge;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public double getRating() {
        return rating;
    }

    public String getBusType() {
        return busType;
    }

    public String getBadge() {
        return badge;
    }
}
