package com.miyuki.dto;

import com.miyuki.entity.User;

public class LoginResponse {
    private String token;
    private Object user;

    public LoginResponse() {}
    public LoginResponse(String token, Object user) {
        this.token = token;
        this.user = user;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Object getUser() { return user; }
    public void setUser(Object user) { this.user = user; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private Object user;
        public Builder token(String token) { this.token = token; return this; }
        public Builder user(Object user) { this.user = user; return this; }
        public LoginResponse build() { return new LoginResponse(token, user); }
    }
}
