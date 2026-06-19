package com.miyuki.controller;

import com.miyuki.dto.AuthRequest;
import com.miyuki.dto.LoginResponse;
import com.miyuki.dto.ErrorResponse;
import com.miyuki.entity.User;
import com.miyuki.service.UserService;
import com.miyuki.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        try {
            User user = userService.registerUser(
                request.getEmail(),
                request.getPassword(),
                request.getFullName(),
                request.getPhone()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(e.getMessage(), 400, "/auth/register"));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            String token = authService.authenticate(request.getEmail(), request.getPassword());
            User user = authService.getUserFromToken(token);
            LoginResponse response = LoginResponse.builder()
                .token(token)
                .user(user)
                .build();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse(e.getMessage(), 401, "/auth/login"));
        }
    }

    @PostMapping("/validate-token")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String token) {
        try {
            String jwtToken = token.replace("Bearer ", "");
            boolean isValid = authService.validateToken(jwtToken);
            return ResponseEntity.ok(java.util.Map.of("valid", isValid));
        } catch (Exception e) {
            return ResponseEntity.ok(java.util.Map.of("valid", false));
        }
    }
}
