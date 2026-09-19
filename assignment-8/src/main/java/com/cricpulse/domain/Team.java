package com.cricpulse.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "teams")
public class Team {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true, length = 80)
    private String name;
    @Column(nullable = false, unique = true, length = 5)
    private String shortName;
    @Column(nullable = false, length = 7)
    private String color;

    protected Team() {}
    public Team(String name, String shortName, String color) {
        this.name = name; this.shortName = shortName; this.color = color;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getShortName() { return shortName; }
    public String getColor() { return color; }
}
