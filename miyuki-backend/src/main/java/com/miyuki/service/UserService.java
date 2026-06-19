package com.miyuki.service;

import com.miyuki.entity.User;
import com.miyuki.entity.Role;
import com.miyuki.repository.UserRepository;
import com.miyuki.repository.RoleRepository;
import com.miyuki.exception.ResourceNotFoundException;
import com.miyuki.exception.DuplicateEmailException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public User registerUser(String email, String password, String fullName, String phone) {
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateEmailException("Email đã được sử dụng");
        }

        User user = User.builder()
            .email(email)
            .fullName(fullName)
            .phone(phone)
            .passwordHash(passwordEncoder.encode(password))
            .status(User.UserStatus.ACTIVE)
            .build();

        Role customerRole = roleRepository.findByRoleName("CUSTOMER")
            .orElseThrow(() -> new ResourceNotFoundException("Role CUSTOMER không tồn tại"));
        
        user.getRoles().add(customerRole);
        return userRepository.save(user);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Người dùng không tồn tại"));
    }

    public User updateUser(Long userId, User updatedUser) {
        User user = getUserById(userId);
        user.setFullName(updatedUser.getFullName());
        user.setPhone(updatedUser.getPhone());
        user.setAddress(updatedUser.getAddress());
        return userRepository.save(user);
    }

    public void changePassword(Long userId, String oldPassword, String newPassword) {
        User user = getUserById(userId);
        if (!passwordEncoder.matches(oldPassword, user.getPasswordHash())) {
            throw new RuntimeException("Mật khẩu cũ không đúng");
        }
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }
}
