package com.vietride.api.config;

import com.vietride.api.model.BusOperator;
import com.vietride.api.model.BusRoute;
import com.vietride.api.model.City;
import com.vietride.api.model.Trip;
import com.vietride.api.repository.BusOperatorRepository;
import com.vietride.api.repository.BusRouteRepository;
import com.vietride.api.repository.CityRepository;
import com.vietride.api.repository.BookingRepository;
import com.vietride.api.repository.TripRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final CityRepository cityRepository;
    private final BusOperatorRepository operatorRepository;
    private final BusRouteRepository routeRepository;
    private final TripRepository tripRepository;
    private final BookingRepository bookingRepository;

    public DataSeeder(CityRepository cityRepository, BusOperatorRepository operatorRepository,
                      BusRouteRepository routeRepository, TripRepository tripRepository,
                      BookingRepository bookingRepository) {
        this.cityRepository = cityRepository;
        this.operatorRepository = operatorRepository;
        this.routeRepository = routeRepository;
        this.tripRepository = tripRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    public void run(String... args) {
        // Clear old database data to ensure new accented Vietnamese cities and trips are populated correctly
        bookingRepository.deleteAll();
        tripRepository.deleteAll();
        routeRepository.deleteAll();
        operatorRepository.deleteAll();
        cityRepository.deleteAll();

        City hcm = cityRepository.save(new City("Hồ Chí Minh", "Miền Nam"));
        City daNang = cityRepository.save(new City("Đà Nẵng", "Miền Trung"));
        City daLat = cityRepository.save(new City("Đà Lạt", "Tây Nguyên"));
        City haNoi = cityRepository.save(new City("Hà Nội", "Miền Bắc"));
        City haiPhong = cityRepository.save(new City("Hải Phòng", "Miền Bắc"));
        City canTho = cityRepository.save(new City("Cần Thơ", "Miền Tây"));
        City nhaTrang = cityRepository.save(new City("Nha Trang", "Duyên hải Nam Trung Bộ"));
        City saPa = cityRepository.save(new City("Sa Pa", "Miền Bắc"));
        City vungTau = cityRepository.save(new City("Vũng Tàu", "Miền Nam"));

        BusOperator futa = operatorRepository.save(new BusOperator("Phương Trang (FUTA Bus Lines)", 4.8, "Sleeper 34", "AN TOÀN"));
        BusOperator thanhBuoi = operatorRepository.save(new BusOperator("Thành Bưởi Limousine", 4.9, "Cabin 24", "SANG TRỌNG"));
        BusOperator saoViet = operatorRepository.save(new BusOperator("Sao Việt Premium", 4.7, "Limousine 22", "TỐC HÀNH"));
        BusOperator haiVan = operatorRepository.save(new BusOperator("Hải Vân Express", 4.8, "Luxury 18", "UY TÍN"));
        BusOperator toanThang = operatorRepository.save(new BusOperator("Toàn Thắng Limousine", 4.6, "Limousine 9", "NHANH CHÓNG"));

        BusRoute r1 = routeRepository.save(new BusRoute(hcm, daNang, 1080, 450000, "HOT"));
        BusRoute r2 = routeRepository.save(new BusRoute(hcm, daLat, 420, 300000, "PHỔ BIẾN"));
        BusRoute r3 = routeRepository.save(new BusRoute(haNoi, haiPhong, 120, 160000, "VIP"));
        BusRoute r4 = routeRepository.save(new BusRoute(haNoi, saPa, 360, 320000, "DU LỊCH"));
        BusRoute r5 = routeRepository.save(new BusRoute(hcm, nhaTrang, 480, 350000, "BIỂN ĐẸP"));
        BusRoute r6 = routeRepository.save(new BusRoute(hcm, vungTau, 150, 180000, "TỐC HÀNH"));
        BusRoute r7 = routeRepository.save(new BusRoute(daNang, haNoi, 840, 400000, "NIGHT"));

        LocalDate today = LocalDate.now();
        List<Trip> trips = List.of(
                // HCM - Đà Nẵng
                trip(r1, futa, today, 8, 0, 450000, 34, 15),
                trip(r1, thanhBuoi, today, 17, 30, 650000, 24, 8),
                trip(r1, futa, today.plusDays(1), 8, 0, 450000, 34, 5),

                // HCM - Đà Lạt
                trip(r2, futa, today, 7, 0, 300000, 34, 20),
                trip(r2, thanhBuoi, today, 22, 0, 420000, 24, 18),
                trip(r2, futa, today.plusDays(1), 7, 0, 300000, 34, 12),
                trip(r2, thanhBuoi, today.plusDays(1), 22, 30, 420000, 24, 4),

                // Hà Nội - Hải Phòng
                trip(r3, haiVan, today, 9, 30, 220000, 18, 10),
                trip(r3, toanThang, today, 14, 0, 160000, 9, 2),
                trip(r3, haiVan, today.plusDays(1), 9, 30, 220000, 18, 5),

                // Hà Nội - Sa Pa
                trip(r4, saoViet, today, 6, 30, 320000, 22, 14),
                trip(r4, haiVan, today, 22, 0, 450000, 18, 12),
                trip(r4, saoViet, today.plusDays(1), 7, 0, 320000, 22, 6),

                // HCM - Nha Trang
                trip(r5, futa, today, 20, 30, 350000, 34, 25),
                trip(r5, thanhBuoi, today, 21, 30, 480000, 24, 14),
                trip(r5, futa, today.plusDays(1), 20, 30, 350000, 34, 10),

                // HCM - Vũng Tàu
                trip(r6, toanThang, today, 8, 0, 180000, 9, 4),
                trip(r6, toanThang, today, 11, 0, 180000, 9, 1),
                trip(r6, toanThang, today.plusDays(1), 8, 0, 180000, 9, 2)
        );
        tripRepository.saveAll(trips);
        tripRepository.saveAll(trips);
    }

    private Trip trip(BusRoute route, BusOperator operator, LocalDate date, int hour, int minute,
                      int price, int totalSeats, int bookedSeats) {
        LocalDateTime departure = date.atTime(hour, minute);
        LocalDateTime arrival = departure.plusMinutes(route.getDurationMinutes());
        return new Trip(route, operator, departure, arrival, BigDecimal.valueOf(price), totalSeats, bookedSeats);
    }
}
