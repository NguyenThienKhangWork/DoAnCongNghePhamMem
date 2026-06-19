package com.miyuki.controller;

import com.miyuki.repository.*;
import com.miyuki.entity.*;
import com.miyuki.dto.CreateTripRequest;
import com.miyuki.service.TripService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;
    private final RouteRepository routeRepository;
    private final BusRepository busRepository;
    private final ReviewRepository reviewRepository;
    private final NotificationRepository notificationRepository;
    private final RefundRepository refundRepository;
    private final TripService tripService;

    // ==================== USERS ====================

    @GetMapping("/users")
    public ResponseEntity<Page<User>> getUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(userRepository.findAll(pageable));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(user.get());
    }

    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<User> optUser = userRepository.findById(id);
        if (optUser.isEmpty()) return ResponseEntity.notFound().build();
        User user = optUser.get();
        try {
            user.setStatus(User.UserStatus.valueOf(body.get("status")));
            userRepository.save(user);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }

    // ==================== TRIPS ====================

    @GetMapping("/trips")
    public ResponseEntity<Page<Trip>> getTrips(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(tripRepository.findAll(pageable));
    }

    @PostMapping("/trips")
    public ResponseEntity<Trip> createTrip(@RequestBody CreateTripRequest request) {
        Trip trip = tripService.createTrip(
                request.getRouteId(), request.getBusId(),
                request.getDepartureTime(), request.getArrivalTime(), request.getPrice());
        return ResponseEntity.ok(trip);
    }

    @PutMapping("/trips/{id}/status")
    public ResponseEntity<?> updateTripStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Trip> optTrip = tripRepository.findById(id);
        if (optTrip.isEmpty()) return ResponseEntity.notFound().build();
        Trip trip = optTrip.get();
        try {
            trip.setStatus(Trip.TripStatus.valueOf(body.get("status")));
            trip.setUpdatedAt(java.time.LocalDateTime.now());
            tripRepository.save(trip);
            return ResponseEntity.ok(trip);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }

    // ==================== BOOKINGS ====================

    @GetMapping("/bookings")
    public ResponseEntity<Page<Booking>> getBookings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(bookingRepository.findAll(pageable));
    }

    @GetMapping("/bookings/stats")
    public ResponseEntity<Map<String, Object>> getBookingStats() {
        long total = bookingRepository.count();
        BigDecimal revenue = bookingRepository.sumPaidRevenue();
        long pending   = bookingRepository.findAll().stream().filter(b -> b.getBookingStatus() == Booking.BookingStatus.PENDING).count();
        long confirmed = bookingRepository.findAll().stream().filter(b -> b.getBookingStatus() == Booking.BookingStatus.CONFIRMED).count();
        return ResponseEntity.ok(Map.of(
            "totalBookings", total,
            "totalRevenue", revenue != null ? revenue : BigDecimal.ZERO,
            "pendingBookings", pending,
            "confirmedBookings", confirmed
        ));
    }

    // ==================== BUSES ====================

    @GetMapping("/buses")
    public ResponseEntity<?> getBuses() {
        return ResponseEntity.ok(busRepository.findAll());
    }

    // ==================== REVIEWS ====================

    @GetMapping("/reviews")
    public ResponseEntity<Page<Review>> getReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(reviewRepository.findAll(pageable));
    }

    // ==================== NOTIFICATIONS ====================

    @GetMapping("/notifications")
    public ResponseEntity<Page<Notification>> getNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(notificationRepository.findAll(pageable));
    }

    // ==================== REFUNDS ====================

    @GetMapping("/refunds")
    public ResponseEntity<Page<Refund>> getRefunds(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(refundRepository.findAll(pageable));
    }

    @PutMapping("/refunds/{id}/status")
    public ResponseEntity<?> updateRefundStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Optional<Refund> opt = refundRepository.findById(id);
        if (opt.isEmpty()) return ResponseEntity.notFound().build();
        Refund refund = opt.get();
        try {
            refund.setRefundStatus(Refund.RefundStatus.valueOf(body.get("status")));
            refund.setUpdatedAt(java.time.LocalDateTime.now());
            refundRepository.save(refund);
            return ResponseEntity.ok(refund);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid status"));
        }
    }

    // ==================== DASHBOARD STATS ====================

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long totalUsers     = userRepository.count();
        long totalTrips     = tripRepository.count();
        long totalBookings  = bookingRepository.count();
        long totalReviews   = reviewRepository.count();
        long totalRefunds   = refundRepository.count();
        long pendingRefunds = refundRepository.findAll().stream()
            .filter(r -> r.getRefundStatus() == Refund.RefundStatus.PENDING).count();
        BigDecimal totalRevenue  = bookingRepository.sumPaidRevenue();
        Long todayBookings       = bookingRepository.countTodayBookings();
        Long activeRoutes        = routeRepository.countByStatus(Route.RouteStatus.ACTIVE);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers",     totalUsers);
        stats.put("totalTrips",     totalTrips);
        stats.put("totalBookings",  totalBookings);
        stats.put("totalRevenue",   totalRevenue  != null ? totalRevenue  : BigDecimal.ZERO);
        stats.put("todayBookings",  todayBookings != null ? todayBookings : 0L);
        stats.put("activeRoutes",   activeRoutes  != null ? activeRoutes  : 0L);
        stats.put("totalReviews",   totalReviews);
        stats.put("totalRefunds",   totalRefunds);
        stats.put("pendingRefunds", pendingRefunds);
        return ResponseEntity.ok(stats);
    }
}
