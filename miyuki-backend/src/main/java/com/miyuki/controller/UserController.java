package com.miyuki.controller;

import com.miyuki.dto.ChangePasswordRequest;
import com.miyuki.dto.UpdateProfileRequest;
import com.miyuki.dto.UserDTO;
import com.miyuki.entity.User;
import com.miyuki.service.AuthService;
import com.miyuki.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;
    private final AuthService authService;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return (User) auth.getPrincipal();
        }
        throw new RuntimeException("Không xác định được người dùng");
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getUserProfile() {
        return ResponseEntity.ok(UserDTO.from(getCurrentUser()));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request) {
        User currentUser = getCurrentUser();
        User updated = User.builder()
            .fullName(request.getFullName())
            .phone(request.getPhone())
            .address(request.getAddress())
            .build();
        User result = userService.updateUser(currentUser.getUserId(), updated);
        return ResponseEntity.ok(UserDTO.from(result));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest request) {
        User currentUser = getCurrentUser();
        userService.changePassword(
            currentUser.getUserId(),
            request.getOldPassword(),
            request.getNewPassword()
        );
        return ResponseEntity.ok("Mật khẩu đã được thay đổi thành công");
    }
}
