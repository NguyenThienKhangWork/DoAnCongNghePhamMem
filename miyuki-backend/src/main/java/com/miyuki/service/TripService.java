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
                           LocalDateTime arrivalTime, BigDecimal price,
                           Integer vipSeats, Integer windowSeats, Integer regularSeats) {
        Route route = routeRepository.findById(routeId)
            .orElseThrow(() -> new ResourceNotFoundException("Tuyến đường không tồn tại"));

        Bus bus = busRepository.findById(busId)
            .orElseThrow(() -> new ResourceNotFoundException("Xe không tồn tại"));

        // Xác định tổng ghế từ cấu hình admin hoặc lấy từ xe
        int totalSeats = bus.getTotalSeats();
        boolean hasCustomConfig = vipSeats != null || windowSeats != null || regularSeats != null;

        if (hasCustomConfig) {
            int v = vipSeats    != null ? vipSeats    : 0;
            int w = windowSeats != null ? windowSeats : 0;
            int r = regularSeats != null ? regularSeats : 0;
            int customTotal = v + w + r;
            if (customTotal == 0) {
                throw new IllegalArgumentException("Tổng số ghế phải lớn hơn 0");
            }
            if (customTotal > totalSeats) {
                throw new IllegalArgumentException(
                    "Tổng ghế (" + customTotal + ") vượt quá sức chứa xe (" + totalSeats + ")");
            }
            totalSeats = customTotal;
        }

        Trip trip = Trip.builder()
            .route(route)
            .bus(bus)
            .departureTime(departureTime)
            .arrivalTime(arrivalTime)
            .price(price)
            .availableSeats(totalSeats)
            .status(Trip.TripStatus.SCHEDULED)
            .build();

        Trip savedTrip = tripRepository.save(trip);

        if (hasCustomConfig) {
            generateSeatsCustom(savedTrip,
                vipSeats    != null ? vipSeats    : 0,
                windowSeats != null ? windowSeats : 0,
                regularSeats != null ? regularSeats : 0);
        } else {
            generateSeatsForTrip(savedTrip, bus.getTotalSeats(), bus.getBusType());
        }

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

    private void generateSeatsForTrip(Trip trip, int totalSeats, Bus.BusType busType) {
        List<Seat> seats = new ArrayList<>();

        for (int i = 1; i <= totalSeats; i++) {
            Seat.SeatType seatType;

            if (busType == Bus.BusType.LIMOUSINE || busType == Bus.BusType.SLEEPER) {
                seatType = Seat.SeatType.VIP;
            } else {
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

            seats.add(Seat.builder()
                .trip(trip)
                .seatNumber(formatSeatNumber(i))
                .seatType(seatType)
                .isAvailable(true)
                .build());
        }

        seatRepository.saveAll(seats);
    }

    /**
     * Tạo ghế theo cấu hình tùy chỉnh từ admin.
     * Thứ tự: VIP trước (hàng A...), WINDOW tiếp, REGULAR cuối.
     */
    private void generateSeatsCustom(Trip trip, int vipCount, int windowCount, int regularCount) {
        List<Seat> seats = new ArrayList<>();
        int index = 1;

        for (int i = 0; i < vipCount; i++, index++) {
            seats.add(Seat.builder()
                .trip(trip).seatNumber(formatSeatNumber(index))
                .seatType(Seat.SeatType.VIP).isAvailable(true).build());
        }
        for (int i = 0; i < windowCount; i++, index++) {
            seats.add(Seat.builder()
                .trip(trip).seatNumber(formatSeatNumber(index))
                .seatType(Seat.SeatType.WINDOW).isAvailable(true).build());
        }
        for (int i = 0; i < regularCount; i++, index++) {
            seats.add(Seat.builder()
                .trip(trip).seatNumber(formatSeatNumber(index))
                .seatType(Seat.SeatType.REGULAR).isAvailable(true).build());
        }

        seatRepository.saveAll(seats);
    }

    private String formatSeatNumber(int index) {
        int seatsPerRow = 4;
        int row = (index - 1) / seatsPerRow;
        int col = (index - 1) % seatsPerRow + 1;
        char rowChar = (char) ('A' + row);
        return rowChar + String.valueOf(col);
    }
}
