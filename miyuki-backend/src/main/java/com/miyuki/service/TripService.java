package com.miyuki.service;

import com.miyuki.entity.Bus;
import com.miyuki.entity.Route;
import com.miyuki.entity.Trip;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.repository.BusRepository;
import com.miyuki.repository.RouteRepository;
import com.miyuki.repository.TripRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TripService {
    private final TripRepository tripRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;

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

        return tripRepository.save(trip);
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
