package com.example.asset.service;

import com.example.asset.dto.DashboardSummary;
import com.example.asset.model.FleetStatus;
import com.example.asset.model.FleetUnit;
import com.example.asset.repository.FleetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final FleetRepository fleetRepository;

    public DashboardService(FleetRepository fleetRepository) {
        this.fleetRepository = fleetRepository;
    }

    public DashboardSummary summary() {
        List<FleetUnit> units = fleetRepository.findAll();

        long total = units.size();
        long operational = units.stream().filter(u -> u.getStatus() == FleetStatus.OPERATIONAL).count();
        long maintenance = units.stream().filter(u -> u.getStatus() == FleetStatus.MAINTENANCE).count();
        long depots = units.stream().map(FleetUnit::getDepot).distinct().count();
        double avgUtil = units.stream()
                .filter(u -> u.getStatus() == FleetStatus.OPERATIONAL)
                .mapToInt(FleetUnit::getUtilization)
                .average()
                .orElse(0);

        List<DashboardSummary.Kpi> kpis = List.of(
                new DashboardSummary.Kpi("Total Assets", String.valueOf(total),
                        "across " + depots + " depots"),
                new DashboardSummary.Kpi("Units Deployed", String.valueOf(operational),
                        "active right now"),
                new DashboardSummary.Kpi("Avg Utilization", Math.round(avgUtil) + "%",
                        "operational units"),
                new DashboardSummary.Kpi("Maintenance Due", String.valueOf(maintenance),
                        "in maintenance")
        );

        // Assets grouped by category, largest first — same shape the UI expects.
        Map<String, Long> byCategory = units.stream()
                .collect(Collectors.groupingBy(FleetUnit::getCategory, Collectors.counting()));
        List<DashboardSummary.CategoryDatum> categories = byCategory.entrySet().stream()
                .map(e -> new DashboardSummary.CategoryDatum(e.getKey(), e.getValue()))
                .sorted((a, b) -> Long.compare(b.value(), a.value()))
                .toList();

        return new DashboardSummary(kpis, categories);
    }
}
