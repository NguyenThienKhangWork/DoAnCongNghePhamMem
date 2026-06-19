package com.miyuki.controller;

import com.miyuki.entity.Seat;
import com.miyuki.repository.SeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SeatController {
    private final SeatRepository seatRepository;

    @GetMapping("/trip/{tripId}")
    public ResponseEntity<List<Seat>> getSeatsByTrip(@PathVariable Long tripId) {
        List<Seat> seats = seatRepository.findByTrip_TripId(tripId);
        return ResponseEntity.ok(seats);
    }

    @GetMapping("/trip/{tripId}/available")
    public ResponseEntity<List<Seat>> getAvailableSeatsByTrip(@PathVariable Long tripId) {
        List<Seat> seats = seatRepository.findByTrip_TripIdAndIsAvailable(tripId, true);
        return ResponseEntity.ok(seats);
    }
}
