package com.cricpulse.domain;

import jakarta.persistence.*;

@Entity
@Table(name = "player_match_stats", uniqueConstraints = @UniqueConstraint(columnNames = {"match_id", "player_id"}))
public class PlayerMatchStat {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "match_id")
    private CricketMatch match;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "player_id")
    private Player player;
    private int runs;
    private int ballsFaced;
    private int fours;
    private int sixes;
    private int wickets;
    private int ballsBowled;
    private int runsConceded;

    protected PlayerMatchStat() {}
    public PlayerMatchStat(CricketMatch match, Player player) { this.match = match; this.player = player; }
    public void recordBatting(int runs, boolean legalBall) {
        this.runs += runs; if (legalBall) ballsFaced++; if (runs == 4) fours++; if (runs == 6) sixes++;
    }
    public void recordBowling(int runs, boolean legalBall, boolean wicket) {
        runsConceded += runs; if (legalBall) ballsBowled++; if (wicket) wickets++;
    }
    public Long getId() { return id; }
    public Player getPlayer() { return player; }
    public int getRuns() { return runs; }
    public int getBallsFaced() { return ballsFaced; }
    public int getFours() { return fours; }
    public int getSixes() { return sixes; }
    public int getWickets() { return wickets; }
    public int getBallsBowled() { return ballsBowled; }
    public int getRunsConceded() { return runsConceded; }
}
