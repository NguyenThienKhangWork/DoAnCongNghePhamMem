package com.miyuki.repository;

import com.miyuki.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findAll(Pageable pageable);
    List<Review> findByUser_UserId(Long userId);
    List<Review> findByTrip_TripId(Long tripId);
}
