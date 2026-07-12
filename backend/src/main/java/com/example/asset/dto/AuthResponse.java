package com.example.asset.dto;

public record AuthResponse(
        String token,
        String username,
        String name,
        String role
) {
}
