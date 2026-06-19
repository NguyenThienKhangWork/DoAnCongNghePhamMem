package com.miyuki.controller;

import com.miyuki.dto.CreateTripRequest;
import com.miyuki.entity.Route;
import com.miyuki.entity.Trip;
import com.miyuki.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/trips")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TripController {
    private final TripService tripService;

    @GetMapping("/search")
    public ResponseEntity<List<Trip>> searchTrips(
        @RequestParam String departure,
        @RequestParam String destination,
        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        List<Trip> trips = tripService.searchTrips(departure, destination, date);
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<Trip> getTripById(@PathVariable Long tripId) {
        Trip trip = tripService.getTripById(tripId);
        return ResponseEntity.ok(trip);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Trip>> getPopularTrips() {
        List<Trip> trips = tripService.getPopularRoutes();
        return ResponseEntity.ok(trips);
    }

    @GetMapping("/routes")
    public ResponseEntity<List<Route>> getAllRoutes() {
        return ResponseEntity.ok(tripService.getAllRoutes());
    }

    @PostMapping
    public ResponseEntity<Trip> createTrip(@RequestBody CreateTripRequest request) {
        Trip trip = tripService.createTrip(
            request.getRouteId(),
            request.getBusId(),
            request.getDepartureTime(),
            request.getArrivalTime(),
            request.getPrice()
        );
        return ResponseEntity.ok(trip);
    }
}
