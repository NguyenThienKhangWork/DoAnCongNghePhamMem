package com.vietride.api.service;

import com.vietride.api.dto.RouteDto;
import com.vietride.api.dto.TripDto;
import com.vietride.api.model.BusRoute;
import com.vietride.api.model.Trip;
import com.vietride.api.repository.BusRouteRepository;
import com.vietride.api.repository.TripRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TripService {
    private final TripRepository tripRepository;
    private final BusRouteRepository routeRepository;
    private final TripMapper mapper;

    public TripService(TripRepository tripRepository, BusRouteRepository routeRepository, TripMapper mapper) {
        this.tripRepository = tripRepository;
        this.routeRepository = routeRepository;
        this.mapper = mapper;
    }

    public List<TripDto> search(String origin, String destination, LocalDate date) {
        LocalDate travelDate = date == null ? LocalDate.now() : date;
        LocalDateTime from = travelDate.atStartOfDay();
        LocalDateTime to = travelDate.plusDays(1).atStartOfDay();
        return tripRepository.search(blankToNull(origin), blankToNull(destination), from, to)
                .stream()
                .map(mapper::toTripDto)
                .toList();
    }

    public List<RouteDto> popularRoutes() {
        List<Trip> trips = tripRepository.findAll();
        return routeRepository.findAll().stream()
                .map(route -> toRouteDto(route, trips))
                .sorted(Comparator.comparing(RouteDto::availableSeats).reversed())
                .toList();
    }

    private RouteDto toRouteDto(BusRoute route, List<Trip> trips) {
        List<Trip> routeTrips = trips.stream()
                .filter(trip -> trip.getRoute().getId().equals(route.getId()))
                .toList();
        int minPrice = routeTrips.stream()
                .map(Trip::getPrice)
                .min(BigDecimal::compareTo)
                .map(BigDecimal::intValue)
                .orElse(0);
        int seats = routeTrips.stream().mapToInt(Trip::getAvailableSeats).sum();
        return new RouteDto(
                route.getId(),
                route.getOrigin().getName(),
                route.getDestination().getName(),
                route.getDistanceKm(),
                route.getDurationMinutes(),
                route.getBadge(),
                minPrice,
                seats
        );
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }
}
