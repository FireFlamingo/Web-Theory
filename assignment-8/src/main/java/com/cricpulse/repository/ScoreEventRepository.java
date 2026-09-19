package com.cricpulse.repository;

import com.cricpulse.domain.ScoreEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ScoreEventRepository extends JpaRepository<ScoreEvent, Long> {
    List<ScoreEvent> findTop12ByMatchIdOrderBySequenceNumberDesc(Long matchId);
    long countByMatchId(Long matchId);
}
