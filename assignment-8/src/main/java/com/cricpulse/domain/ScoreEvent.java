package com.cricpulse.domain;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "score_events", indexes = @Index(name = "idx_event_match_sequence", columnList = "match_id,sequenceNumber"))
public class ScoreEvent {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY, optional = false) @JoinColumn(name = "match_id")
    private CricketMatch match;
    private long sequenceNumber;
    private int inningsNumber;
    private int overNumber;
    private int ballNumber;
    private int runs;
    private boolean wicket;
    private boolean legalBall;
    @Column(nullable = false, length = 40)
    private String eventType;
    @Column(nullable = false, length = 240)
    private String description;
    @Column(nullable = false)
    private Instant createdAt;

    protected ScoreEvent() {}
    public ScoreEvent(CricketMatch match, long sequenceNumber, int runs, boolean wicket, boolean legalBall, String eventType, String description) {
        this.match = match; this.sequenceNumber = sequenceNumber; this.inningsNumber = match.getInningsNumber();
        int completedBalls = match.getBalls();
        this.overNumber = legalBall && completedBalls > 0 && completedBalls % 6 == 0
                ? completedBalls / 6 - 1 : completedBalls / 6;
        this.ballNumber = legalBall && completedBalls > 0 && completedBalls % 6 == 0
                ? 6 : completedBalls % 6;
        this.runs = runs; this.wicket = wicket; this.legalBall = legalBall;
        this.eventType = eventType; this.description = description; this.createdAt = Instant.now();
    }
    public Long getId() { return id; }
    public long getSequenceNumber() { return sequenceNumber; }
    public int getInningsNumber() { return inningsNumber; }
    public int getOverNumber() { return overNumber; }
    public int getBallNumber() { return ballNumber; }
    public int getRuns() { return runs; }
    public boolean isWicket() { return wicket; }
    public boolean isLegalBall() { return legalBall; }
    public String getEventType() { return eventType; }
    public String getDescription() { return description; }
    public Instant getCreatedAt() { return createdAt; }
}
