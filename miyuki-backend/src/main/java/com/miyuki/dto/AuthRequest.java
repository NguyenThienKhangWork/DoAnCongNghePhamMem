package com.miyuki.dto;

public class AuthRequest {
    private String email;
    private String password;
    private String fullName;
    private String phone;

    public AuthRequest() {}

    public AuthRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }

    public AuthRequest(String email, String password, String fullName, String phone) {
        this.email = email;
        this.password = password;
        this.fullName = fullName;
        this.phone = phone;
    }

    // Getters and Setters
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    // Builder
    public static AuthRequestBuilder builder() {
        return new AuthRequestBuilder();
    }

    public static class AuthRequestBuilder {
        private String email;
        private String password;
        private String fullName;
        private String phone;

        public AuthRequestBuilder email(String email) {
            this.email = email;
            return this;
        }

        public AuthRequestBuilder password(String password) {
            this.password = password;
            return this;
        }

        public AuthRequestBuilder fullName(String fullName) {
            this.fullName = fullName;
            return this;
        }

        public AuthRequestBuilder phone(String phone) {
            this.phone = phone;
            return this;
        }

        public AuthRequest build() {
            return new AuthRequest(email, password, fullName, phone);
        }
    }
}
