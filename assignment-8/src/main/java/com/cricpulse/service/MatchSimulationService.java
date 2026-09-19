package com.cricpulse.service;

import com.cricpulse.api.ApiModels.ScoreRequest;
import com.cricpulse.domain.MatchStatus;
import com.cricpulse.repository.MatchRepository;
import org.slf4j.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class MatchSimulationService {
    private static final Logger log = LoggerFactory.getLogger(MatchSimulationService.class);
    private final MatchRepository matches;
    private final MatchService matchService;
    private final LiveScorePublisher publisher;

    public MatchSimulationService(MatchRepository matches, MatchService matchService, LiveScorePublisher publisher) {
        this.matches = matches; this.matchService = matchService; this.publisher = publisher;
    }

    @Scheduled(fixedDelayString = "${cricpulse.simulation.interval-ms:3500}")
    public void simulateDeliveries() {
        matches.findByStatusAndSimulationEnabledTrue(MatchStatus.LIVE).forEach(match -> {
            try { matchService.score(match.getId(), randomDelivery()); }
            catch (RuntimeException e) { log.warn("Could not simulate delivery for match {}: {}", match.getId(), e.getMessage()); }
        });
    }

    @Scheduled(fixedDelay = 20000)
    public void keepConnectionsAlive() { publisher.heartbeat(); }

    private ScoreRequest randomDelivery() {
        int roll = ThreadLocalRandom.current().nextInt(100);
        if (roll < 4) return new ScoreRequest(0, true, "WICKET", null);
        if (roll < 9) return new ScoreRequest(1, false, "WIDE", null);
        int[] outcomes = {0, 0, 0, 1, 1, 1, 2, 2, 3, 4, 4, 6};
        return new ScoreRequest(outcomes[ThreadLocalRandom.current().nextInt(outcomes.length)], false, "RUNS", null);
    }
}
