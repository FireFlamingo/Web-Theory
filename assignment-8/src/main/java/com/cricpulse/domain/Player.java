package com.cricpulse.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "players")
public class Player {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 80)
    private String name;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private PlayerRole role;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Team team;

    protected Player() {}
    public Player(String name, PlayerRole role, Team team) {
        this.name = name; this.role = role; this.team = team;
    }
    public Long getId() { return id; }
    public String getName() { return name; }
    public PlayerRole getRole() { return role; }
    public Team getTeam() { return team; }
}
