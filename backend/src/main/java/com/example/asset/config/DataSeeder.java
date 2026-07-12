package com.example.asset.config;

import com.example.asset.model.FleetStatus;
import com.example.asset.model.FleetUnit;
import com.example.asset.model.Role;
import com.example.asset.model.User;
import com.example.asset.repository.FleetRepository;
import com.example.asset.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Seeds an initial admin account and demo fleet data on first startup.
 * Runs only when the respective tables are empty, so it is safe to keep on.
 */
@Component
public class DataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeeder.class);

    private final UserRepository userRepository;
    private final FleetRepository fleetRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeeder(UserRepository userRepository,
                      FleetRepository fleetRepository,
                      PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.fleetRepository = fleetRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedAdmin();
        seedFleet();
    }

    private void seedAdmin() {
        if (userRepository.count() > 0) {
            return;
        }
        User admin = new User(
                "Administrator", "admin", "admin@assetflow.local",
                passwordEncoder.encode("admin123"), Role.ADMIN);
        userRepository.save(admin);
        log.info("Seeded default admin user (username=admin / password=admin123). Change this in production!");
    }

    private void seedFleet() {
        if (fleetRepository.count() > 0) {
            return;
        }
        List<FleetUnit> units = List.of(
                new FleetUnit("FM-2201", "Brofist Hauler", "Tokyo-1", "Haulers", FleetStatus.OPERATIONAL, 92),
                new FleetUnit("FM-1180", "Nine-Year Loader", "Brighton", "Loaders", FleetStatus.OPERATIONAL, 88),
                new FleetUnit("FM-3390", "Chair Drone MK4", "Tokyo-2", "Drones", FleetStatus.MAINTENANCE, 41),
                new FleetUnit("FM-0455", "Floor Gang Charger", "Osaka", "Chargers", FleetStatus.OPERATIONAL, 76),
                new FleetUnit("FM-7712", "Meme Sensor Array", "Brighton", "Sensors", FleetStatus.OFFLINE, 0),
                new FleetUnit("FM-6089", "Bro Loader XL", "Tokyo-1", "Loaders", FleetStatus.OPERATIONAL, 95)
        );
        fleetRepository.saveAll(units);
        log.info("Seeded {} demo fleet units.", units.size());
    }
}
