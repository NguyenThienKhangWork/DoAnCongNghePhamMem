package com.miyuki.service;

import com.miyuki.entity.User;
import com.miyuki.exception.InvalidCredentialsException;
import com.miyuki.repository.UserRepository;
import com.miyuki.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    public String authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new InvalidCredentialsException("Email hoặc mật khẩu không chính xác"));

        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new InvalidCredentialsException("Email hoặc mật khẩu không chính xác");
        }

        if (user.getStatus() == User.UserStatus.BLOCKED) {
            throw new InvalidCredentialsException("Tài khoản đã bị khóa");
        }

        // Lấy roles thực từ DB, fallback về CUSTOMER nếu không có
        String[] authorities = user.getRoles().isEmpty()
            ? new String[]{"ROLE_CUSTOMER"}
            : user.getRoles().stream()
                .map(role -> "ROLE_" + role.getRoleName())
                .toArray(String[]::new);

        return jwtTokenProvider.generateToken(
            org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .build()
        );
    }

    public User getUserFromToken(String token) {
        String email = jwtTokenProvider.getUsernameFromToken(token);
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new InvalidCredentialsException("Người dùng không tồn tại"));
    }

    public boolean validateToken(String token) {
        return jwtTokenProvider.isTokenValid(token);
    }
}
