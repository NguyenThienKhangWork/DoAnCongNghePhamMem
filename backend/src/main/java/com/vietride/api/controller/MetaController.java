package com.vietride.api.controller;

import com.vietride.api.dto.CityDto;
import com.vietride.api.dto.DashboardDto;
import com.vietride.api.repository.CityRepository;
import com.vietride.api.service.DashboardService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class MetaController {
    private final CityRepository cityRepository;
    private final DashboardService dashboardService;

    public MetaController(CityRepository cityRepository, DashboardService dashboardService) {
        this.cityRepository = cityRepository;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/cities")
    public List<CityDto> cities() {
        return cityRepository.findAll().stream()
                .map(city -> new CityDto(city.getId(), city.getName(), city.getRegion()))
                .toList();
    }

    @GetMapping("/dashboard")
    public DashboardDto dashboard() {
        return dashboardService.metrics();
    }
}
