package com.vietride.api.controller;

import com.vietride.api.dto.RouteDto;
import com.vietride.api.dto.TripDto;
import com.vietride.api.service.TripService;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class TripController {
    private final TripService tripService;

    public TripController(TripService tripService) {
        this.tripService = tripService;
    }

    @GetMapping("/trips/search")
    public List<TripDto> searchTrips(
            @RequestParam(required = false) String origin,
            @RequestParam(required = false) String destination,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return tripService.search(origin, destination, date);
    }

    @GetMapping("/routes/popular")
    public List<RouteDto> popularRoutes() {
        return tripService.popularRoutes();
    }
}
