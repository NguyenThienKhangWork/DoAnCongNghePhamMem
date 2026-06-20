package com.miyuki.dto;

import com.miyuki.entity.User;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Safe User DTO - không lộ passwordHash, roles là array đúng format
 */
public class UserDTO {
    private Long userId;
    private String email;
    private String phone;
    private String fullName;
    private String avatarUrl;
    private String address;
    private String identificationNumber;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<RoleDTO> roles;

    public static class RoleDTO {
        private Integer roleId;
        private String roleName;
        private String description;

        public RoleDTO() {}
        public RoleDTO(Integer roleId, String roleName, String description) {
            this.roleId = roleId;
            this.roleName = roleName;
            this.description = description;
        }

        public Integer getRoleId() { return roleId; }
        public String getRoleName() { return roleName; }
        public String getDescription() { return description; }
    }

    public UserDTO() {}

    public static UserDTO from(User user) {
        UserDTO dto = new UserDTO();
        dto.userId = user.getUserId();
        dto.email = user.getEmail();
        dto.phone = user.getPhone();
        dto.fullName = user.getFullName();
        dto.avatarUrl = user.getAvatarUrl();
        dto.address = user.getAddress();
        dto.identificationNumber = user.getIdentificationNumber();
        dto.status = user.getStatus() != null ? user.getStatus().name() : "ACTIVE";
        dto.createdAt = user.getCreatedAt();
        dto.updatedAt = user.getUpdatedAt();
        dto.roles = user.getRoles() != null
            ? user.getRoles().stream()
                .map(r -> new RoleDTO(r.getRoleId(), r.getRoleName(), r.getDescription()))
                .collect(Collectors.toList())
            : List.of();
        return dto;
    }

    public Long getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getFullName() { return fullName; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getAddress() { return address; }
    public String getIdentificationNumber() { return identificationNumber; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public List<RoleDTO> getRoles() { return roles; }
}
