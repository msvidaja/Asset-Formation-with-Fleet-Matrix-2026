package com.example.asset.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

@Entity
@Table(name = "fleet_units")
public class FleetUnit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Business code shown in the UI, e.g. "FM-2201". */
    @NotBlank
    @Column(unique = true)
    private String code;

    @NotBlank
    private String name;

    @NotBlank
    private String depot;

    /** Asset category used for dashboard grouping, e.g. "Haulers". */
    @NotBlank
    private String category;

    @NotNull
    @Enumerated(EnumType.STRING)
    private FleetStatus status = FleetStatus.OPERATIONAL;

    @Min(0)
    @Max(100)
    private int utilization;

    @Column(nullable = false)
    private Instant updatedAt;

    public FleetUnit() {
    }

    public FleetUnit(String code, String name, String depot, String category,
                     FleetStatus status, int utilization) {
        this.code = code;
        this.name = name;
        this.depot = depot;
        this.category = category;
        this.status = status;
        this.utilization = utilization;
    }

    @PrePersist
    @PreUpdate
    void touch() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDepot() {
        return depot;
    }

    public void setDepot(String depot) {
        this.depot = depot;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public FleetStatus getStatus() {
        return status;
    }

    public void setStatus(FleetStatus status) {
        this.status = status;
    }

    public int getUtilization() {
        return utilization;
    }

    public void setUtilization(int utilization) {
        this.utilization = utilization;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
