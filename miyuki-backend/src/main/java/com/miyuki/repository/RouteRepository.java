package com.miyuki.repository;

import com.miyuki.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByDepartureCityAndDestinationCity(String departure, String destination);
    List<Route> findByStatus(Route.RouteStatus status);
    Long countByStatus(Route.RouteStatus status);
}
