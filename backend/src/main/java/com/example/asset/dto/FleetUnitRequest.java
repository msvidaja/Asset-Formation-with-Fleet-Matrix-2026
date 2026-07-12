package com.example.asset.dto;

import com.example.asset.model.FleetStatus;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record FleetUnitRequest(
        @NotBlank String code,
        @NotBlank String name,
        @NotBlank String depot,
        @NotBlank String category,
        @NotNull FleetStatus status,
        @Min(0) @Max(100) int utilization
) {
}
