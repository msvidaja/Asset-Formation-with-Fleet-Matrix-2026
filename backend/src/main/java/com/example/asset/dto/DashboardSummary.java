package com.example.asset.dto;

import java.util.List;

public record DashboardSummary(
        List<Kpi> kpis,
        List<CategoryDatum> categories
) {
    public record Kpi(String label, String value, String sub) {
    }

    public record CategoryDatum(String label, long value) {
    }
}
