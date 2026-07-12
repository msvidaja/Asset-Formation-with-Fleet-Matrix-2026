package com.example.asset.controller;

import com.example.asset.dto.FleetUnitRequest;
import com.example.asset.model.FleetUnit;
import com.example.asset.service.FleetService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/fleet")
public class FleetController {

    private final FleetService fleetService;

    public FleetController(FleetService fleetService) {
        this.fleetService = fleetService;
    }

    @GetMapping
    public List<FleetUnit> getAll() {
        return fleetService.findAll();
    }

    @GetMapping("/{id}")
    public FleetUnit getById(@PathVariable Long id) {
        return fleetService.findById(id);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FleetUnit> create(@Valid @RequestBody FleetUnitRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(fleetService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public FleetUnit update(@PathVariable Long id, @Valid @RequestBody FleetUnitRequest request) {
        return fleetService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        fleetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
