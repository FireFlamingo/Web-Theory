package com.vit.results;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ResultProcessingApplication {

    public static void main(String[] args) {
        SpringApplication.run(ResultProcessingApplication.class, args);
        System.out.println("=================================================");
        System.out.println("   VIT Semester Result Processing Backend Active  ");
        System.out.println("   Server listening at: http://localhost:8080    ");
        System.out.println("=================================================");
    }
}
