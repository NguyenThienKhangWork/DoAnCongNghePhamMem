package com.vietride.api.model;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "routes")
public class BusRoute {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    private City origin;

    @ManyToOne(fetch = FetchType.LAZY)
    private City destination;

    private int distanceKm;
    private int durationMinutes;
    private String badge;

    protected BusRoute() {
    }

    public BusRoute(City origin, City destination, int distanceKm, int durationMinutes, String badge) {
        this.origin = origin;
        this.destination = destination;
        this.distanceKm = distanceKm;
        this.durationMinutes = durationMinutes;
        this.badge = badge;
    }

    public Long getId() {
        return id;
    }

    public City getOrigin() {
        return origin;
    }

    public City getDestination() {
        return destination;
    }

    public int getDistanceKm() {
        return distanceKm;
    }

    public int getDurationMinutes() {
        return durationMinutes;
    }

    public String getBadge() {
        return badge;
    }
}
