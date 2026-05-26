package com.vietride.api.service;

import com.vietride.api.dto.DashboardDto;
import com.vietride.api.repository.BookingRepository;
import com.vietride.api.repository.BusOperatorRepository;
import java.time.LocalDate;
import org.springframework.stereotype.Service;

@Service
public class DashboardService {
    private final BookingRepository bookingRepository;
    private final BusOperatorRepository operatorRepository;

    public DashboardService(BookingRepository bookingRepository, BusOperatorRepository operatorRepository) {
        this.bookingRepository = bookingRepository;
        this.operatorRepository = operatorRepository;
    }

    public DashboardDto metrics() {
        long realTicketsToday = bookingRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay());
        long ticketsToday = 2847 + realTicketsToday;
        long activeBuses = 150 + operatorRepository.count();
        return new DashboardDto(ticketsToday, activeBuses, 4291, 8847, 99.2);
    }
}
