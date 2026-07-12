package com.example.asset.service;

import com.example.asset.dto.FleetUnitRequest;
import com.example.asset.model.FleetUnit;
import com.example.asset.repository.FleetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class FleetService {

    private final FleetRepository fleetRepository;

    public FleetService(FleetRepository fleetRepository) {
        this.fleetRepository = fleetRepository;
    }

    public List<FleetUnit> findAll() {
        return fleetRepository.findAll();
    }

    public FleetUnit findById(Long id) {
        return fleetRepository.findById(id)
                .orElseThrow(() -> notFound(id));
    }

    public FleetUnit create(FleetUnitRequest request) {
        if (fleetRepository.existsByCode(request.code())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Fleet unit with code already exists: " + request.code());
        }
        FleetUnit unit = new FleetUnit(
                request.code(), request.name(), request.depot(),
                request.category(), request.status(), request.utilization());
        return fleetRepository.save(unit);
    }

    public FleetUnit update(Long id, FleetUnitRequest request) {
        FleetUnit unit = findById(id);
        // Guard against colliding with another unit's code.
        fleetRepository.findByCode(request.code())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "Fleet unit with code already exists: " + request.code());
                });
        unit.setCode(request.code());
        unit.setName(request.name());
        unit.setDepot(request.depot());
        unit.setCategory(request.category());
        unit.setStatus(request.status());
        unit.setUtilization(request.utilization());
        return fleetRepository.save(unit);
    }

    public void delete(Long id) {
        if (!fleetRepository.existsById(id)) {
            throw notFound(id);
        }
        fleetRepository.deleteById(id);
    }

    private ResponseStatusException notFound(Long id) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Fleet unit not found: " + id);
    }
}
