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

        // Tự động tạo ghế dựa trên số ghế của xe
        generateSeatsForTrip(savedTrip, bus.getTotalSeats());

        return savedTrip;
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

    // ─── Tạo ghế tự động theo số lượng và loại xe ──────────────────────────

    private void generateSeatsForTrip(Trip trip, int totalSeats) {
        List<Seat> seats = new ArrayList<>();

        // Phân loại ghế theo loại xe:
        // - LIMOUSINE: tất cả VIP
        // - SLEEPER: tất cả VIP
        // - SEAT: 10% đầu là VIP, 20% tiếp theo là WINDOW, còn lại REGULAR
        Bus.BusType busType = trip.getBus().getBusType();

        for (int i = 1; i <= totalSeats; i++) {
            Seat.SeatType seatType;

            if (busType == Bus.BusType.LIMOUSINE || busType == Bus.BusType.SLEEPER) {
                seatType = Seat.SeatType.VIP;
            } else {
                // SEAT bus: 10% VIP, 20% WINDOW, 70% REGULAR
                int vipCount    = Math.max(1, (int) Math.ceil(totalSeats * 0.10));
                int windowCount = Math.max(1, (int) Math.ceil(totalSeats * 0.20));
                if (i <= vipCount) {
                    seatType = Seat.SeatType.VIP;
                } else if (i <= vipCount + windowCount) {
                    seatType = Seat.SeatType.WINDOW;
                } else {
                    seatType = Seat.SeatType.REGULAR;
                }
            }

            String seatNumber = formatSeatNumber(i, totalSeats);

            seats.add(Seat.builder()
                .trip(trip)
                .seatNumber(seatNumber)
                .seatType(seatType)
                .isAvailable(true)
                .build());
        }

        seatRepository.saveAll(seats);
    }

    private String formatSeatNumber(int index, int total) {
        // Format: A1, A2... B1, B2... (mỗi hàng 4 ghế)
        int seatsPerRow = 4;
        int row = (index - 1) / seatsPerRow;        // 0-based row index
        int col = (index - 1) % seatsPerRow + 1;    // 1-based column
        char rowChar = (char) ('A' + row);
        return rowChar + String.valueOf(col);
    }
}
