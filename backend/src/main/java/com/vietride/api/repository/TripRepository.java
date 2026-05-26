package com.vietride.api.repository;

import com.vietride.api.model.Trip;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TripRepository extends JpaRepository<Trip, Long> {
    @EntityGraph(attributePaths = {"route", "route.origin", "route.destination", "operator"})
    @Query("""
            select t from Trip t
            where (:origin is null or lower(t.route.origin.name) like lower(concat('%', :origin, '%')))
              and (:destination is null or lower(t.route.destination.name) like lower(concat('%', :destination, '%')))
              and t.departureTime >= :from
              and t.departureTime < :to
            order by t.departureTime asc, t.price asc
            """)
    List<Trip> search(@Param("origin") String origin,
                      @Param("destination") String destination,
                      @Param("from") LocalDateTime from,
                      @Param("to") LocalDateTime to);

    @EntityGraph(attributePaths = {"route", "route.origin", "route.destination", "operator"})
    List<Trip> findTop8ByOrderByBookedSeatsDesc();
}
