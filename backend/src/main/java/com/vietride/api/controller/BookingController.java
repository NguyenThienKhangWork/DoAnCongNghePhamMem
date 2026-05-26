package com.vietride.api.controller;

import com.vietride.api.dto.BookingDto;
import com.vietride.api.dto.CreateBookingRequest;
import com.vietride.api.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingDto createBooking(@Valid @RequestBody CreateBookingRequest request) {
        return bookingService.create(request);
    }

    @PostMapping("/{id}/pay")
    public BookingDto payBooking(@PathVariable Long id) {
        return bookingService.pay(id);
    }

    @GetMapping("/lookup")
    public List<BookingDto> lookup(@RequestParam String query) {
        return bookingService.lookup(query);
    }
}
