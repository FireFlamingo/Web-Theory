package com.cricpulse;

import com.cricpulse.domain.MatchStatus;
import com.cricpulse.repository.MatchRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class MatchApiIntegrationTest {
    @Autowired MockMvc mvc;
    @Autowired MatchRepository matches;

    @Test
    void listsSeededMatchesAndDetailedScore() throws Exception {
        long liveId = matches.findByStatusOrderByScheduledAtDesc(MatchStatus.LIVE).getFirst().getId();
        mvc.perform(get("/api/matches"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))))
                .andExpect(jsonPath("$[?(@.status == 'LIVE')]", hasSize(greaterThanOrEqualTo(1))));
        mvc.perform(get("/api/matches/{id}", liveId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.battingTeam.shortName", is("IND")))
                .andExpect(jsonPath("$.recentEvents", hasSize(greaterThan(0))));
    }

    @Test
    void recordsADeliveryAtomically() throws Exception {
        var live = matches.findByStatusOrderByScheduledAtDesc(MatchStatus.LIVE).getFirst();
        int before = live.getRuns();
        mvc.perform(post("/api/matches/{id}/score", live.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"runs\":4,\"wicket\":false,\"eventType\":\"RUNS\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.runs", is(before + 4)))
                .andExpect(jsonPath("$.recentEvents[0].runs", is(4)));
    }

    @Test
    void rejectsScoringAScheduledMatch() throws Exception {
        long scheduledId = matches.findByStatusOrderByScheduledAtDesc(MatchStatus.SCHEDULED).getFirst().getId();
        mvc.perform(post("/api/matches/{id}/score", scheduledId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"runs\":1,\"wicket\":false,\"eventType\":\"RUNS\"}"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("live match")));
    }
}
