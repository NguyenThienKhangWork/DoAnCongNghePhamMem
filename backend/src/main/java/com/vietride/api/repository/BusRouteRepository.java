package com.vietride.api.repository;

import com.vietride.api.model.BusRoute;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BusRouteRepository extends JpaRepository<BusRoute, Long> {
    @EntityGraph(attributePaths = {"origin", "destination"})
    List<BusRoute> findAll();
}
