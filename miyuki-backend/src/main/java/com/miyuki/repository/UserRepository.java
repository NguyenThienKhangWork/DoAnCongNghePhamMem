package com.miyuki.repository;

import com.miyuki.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByPhone(String phone);
    boolean existsByEmail(String email);

    Page<User> findByFullNameContainingOrEmailContainingOrPhoneContaining(String fullName, String email, String phone, Pageable pageable);
    Page<User> findByStatus(User.UserStatus status, Pageable pageable);
}
