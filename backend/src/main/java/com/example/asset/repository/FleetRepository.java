package com.example.asset.repository;

import com.example.asset.model.FleetStatus;
import com.example.asset.model.FleetUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FleetRepository extends JpaRepository<FleetUnit, Long> {

    Optional<FleetUnit> findByCode(String code);

    boolean existsByCode(String code);

    long countByStatus(FleetStatus status);
}
