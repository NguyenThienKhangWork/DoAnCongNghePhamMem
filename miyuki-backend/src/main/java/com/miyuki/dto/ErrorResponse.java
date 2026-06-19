package com.miyuki.dto;

public class ErrorResponse {
    private String message;
    private Integer status;
    private String path;

    public ErrorResponse() {}
    public ErrorResponse(String message, Integer status, String path) {
        this.message = message;
        this.status = status;
        this.path = path;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public Integer getStatus() { return status; }
    public void setStatus(Integer status) { this.status = status; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
}
