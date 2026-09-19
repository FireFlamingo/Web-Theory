package com.cricpulse.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "matches")
public class CricketMatch {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 120)
    private String title;
    @Column(nullable = false, length = 20)
    private String format;
    @Column(nullable = false, length = 120)
    private String venue;
    @Enumerated(EnumType.STRING) @Column(nullable = false)
    private MatchStatus status = MatchStatus.SCHEDULED;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Team teamA;
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    private Team teamB;
    @ManyToOne(fetch = FetchType.LAZY)
    private Team battingTeam;
    @ManyToOne(fetch = FetchType.LAZY)
    private Team bowlingTeam;
    @ManyToOne(fetch = FetchType.LAZY)
    private Player striker;
    @ManyToOne(fetch = FetchType.LAZY)
    private Player nonStriker;
    @ManyToOne(fetch = FetchType.LAZY)
    private Player bowler;
    private int inningsNumber = 1;
    private int totalInnings = 2;
    private int runs;
    private int wickets;
    private int balls;
    private Integer target;
    private Integer firstInningsRuns;
    private Integer firstInningsWickets;
    private Integer firstInningsBalls;
    private int maxOvers = 20;
    private boolean simulationEnabled;
    private String result;
    private Instant scheduledAt;
    private Instant startedAt;
    private Instant updatedAt;
    @Version
    private long version;

    protected CricketMatch() {}
    public CricketMatch(String title, String format, String venue, Team teamA, Team teamB, int maxOvers, Instant scheduledAt) {
        this.title = title; this.format = format; this.venue = venue;
        this.teamA = teamA; this.teamB = teamB; this.maxOvers = maxOvers;
        this.scheduledAt = scheduledAt; this.updatedAt = Instant.now();
    }

    public void start(Team batting, Team bowling, Player striker, Player nonStriker, Player bowler) {
        this.status = MatchStatus.LIVE; this.battingTeam = batting; this.bowlingTeam = bowling;
        this.striker = striker; this.nonStriker = nonStriker; this.bowler = bowler;
        this.startedAt = Instant.now(); this.updatedAt = this.startedAt;
    }
    public void recordBall(int totalRuns, boolean legalBall, boolean wicket) {
        runs += totalRuns;
        if (legalBall) balls++;
        if (wicket) wickets++;
        updatedAt = Instant.now();
    }
    public void swapStrike() { Player p = striker; striker = nonStriker; nonStriker = p; }
    public void setStriker(Player player) { striker = player; }
    public void setBowler(Player player) { bowler = player; }
    public void startSecondInnings(Player striker, Player nonStriker, Player bowler) {
        firstInningsRuns = runs; firstInningsWickets = wickets; firstInningsBalls = balls;
        target = runs + 1; runs = 0; wickets = 0; balls = 0; inningsNumber = 2;
        Team previousBatting = battingTeam; battingTeam = bowlingTeam; bowlingTeam = previousBatting;
        this.striker = striker; this.nonStriker = nonStriker; this.bowler = bowler;
        updatedAt = Instant.now();
    }
    public void setSimulationEnabled(boolean enabled) { simulationEnabled = enabled; }
    public void complete(String result) { status = MatchStatus.COMPLETED; simulationEnabled = false; this.result = result; updatedAt = Instant.now(); }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getFormat() { return format; }
    public String getVenue() { return venue; }
    public MatchStatus getStatus() { return status; }
    public Team getTeamA() { return teamA; }
    public Team getTeamB() { return teamB; }
    public Team getBattingTeam() { return battingTeam; }
    public Team getBowlingTeam() { return bowlingTeam; }
    public Player getStriker() { return striker; }
    public Player getNonStriker() { return nonStriker; }
    public Player getBowler() { return bowler; }
    public int getInningsNumber() { return inningsNumber; }
    public int getTotalInnings() { return totalInnings; }
    public int getRuns() { return runs; }
    public int getWickets() { return wickets; }
    public int getBalls() { return balls; }
    public Integer getTarget() { return target; }
    public Integer getFirstInningsRuns() { return firstInningsRuns; }
    public Integer getFirstInningsWickets() { return firstInningsWickets; }
    public Integer getFirstInningsBalls() { return firstInningsBalls; }
    public int getMaxOvers() { return maxOvers; }
    public boolean isSimulationEnabled() { return simulationEnabled; }
    public String getResult() { return result; }
    public Instant getScheduledAt() { return scheduledAt; }
    public Instant getStartedAt() { return startedAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
