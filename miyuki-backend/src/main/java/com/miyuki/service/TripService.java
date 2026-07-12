package com.miyuki.service;

import com.miyuki.entity.Bus;
import com.miyuki.entity.Route;
import com.miyuki.entity.Seat;
import com.miyuki.entity.Trip;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BusRepository;
import com.miyuki.repository.RouteRepository;
import com.miyuki.repository.SeatRepository;
import com.miyuki.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    private final SeatRepository seatRepository;

    public List<Trip> searchTrips(String departure, String destination, LocalDate date) {
        List<Trip> trips = tripRepository.findByRoute_DepartureCityAndRoute_DestinationCity(departure, destination);

        return trips.stream()
            .filter(trip -> trip.getDepartureTime().toLocalDate().equals(date))
            .filter(trip -> trip.getStatus() == Trip.TripStatus.SCHEDULED)
            .filter(trip -> trip.getAvailableSeats() > 0)
            .toList();
    }

    public Trip getTripById(Long tripId) {
        return tripRepository.findById(tripId)
            .orElseThrow(() -> new ResourceNotFoundException("Chuyến đi không tồn tại"));
    }

    @Transactional
    public Trip createTrip(Long routeId, Long busId, LocalDateTime departureTime,
                           LocalDateTime arrivalTime, BigDecimal price) {
        Route route = routeRepository.findById(routeId)
            .orElseThrow(() -> new ResourceNotFoundException("Tuyến đường không tồn tại"));

        Bus bus = busRepository.findById(busId)
            .orElseThrow(() -> new ResourceNotFoundException("Xe không tồn tại"));

        Trip trip = Trip.builder()
            .route(route)
            .bus(bus)
            .departureTime(departureTime)
            .arrivalTime(arrivalTime)
            .price(price)
            .availableSeats(bus.getTotalSeats())
            .status(Trip.TripStatus.SCHEDULED)
            .build();

        Trip savedTrip = tripRepository.save(trip);
        createSeatsForTrip(savedTrip, bus);
        return savedTrip;
    }

    private void createSeatsForTrip(Trip trip, Bus bus) {
        int totalSeats = bus.getTotalSeats();
        String busType = bus.getBusType().name();
        List<Seat> seats = new ArrayList<>();

        for (int i = 1; i <= totalSeats; i++) {
            String seatLabel = String.format("%c%d",
                (char) ('A' + (i - 1) / 4),
                (i - 1) % 4 + 1
            );

            Seat.SeatType seatType;
            if ("LIMOUSINE".equals(busType)) {
                seatType = Seat.SeatType.VIP;
            } else if ("SLEEPER".equals(busType)) {
                seatType = Seat.SeatType.REGULAR;
            } else if (i % 4 == 2 || i % 4 == 3) {
                seatType = Seat.SeatType.WINDOW;
            } else {
                seatType = Seat.SeatType.REGULAR;
            }

            Seat seat = Seat.builder()
                .trip(trip)
                .seatNumber(seatLabel)
                .seatType(seatType)
                .isAvailable(true)
                .createdAt(LocalDateTime.now())
                .build();
            seats.add(seat);
        }

        seatRepository.saveAll(seats);
    }

    public List<Trip> getPopularRoutes() {
        return tripRepository.findAll().stream()
            .filter(t -> t.getStatus() == Trip.TripStatus.SCHEDULED)
            .limit(6)
            .toList();
    }

    public List<Route> getAllRoutes() {
        return routeRepository.findByStatus(Route.RouteStatus.ACTIVE);
    }
}
