package com.cricpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@EnableScheduling
@SpringBootApplication
public class CricPulseApplication {
    public static void main(String[] args) {
        SpringApplication.run(CricPulseApplication.class, args);
    }
}
