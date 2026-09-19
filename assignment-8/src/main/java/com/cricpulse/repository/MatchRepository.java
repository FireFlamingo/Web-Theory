package com.cricpulse.repository;

import com.cricpulse.domain.CricketMatch;
import com.cricpulse.domain.MatchStatus;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import java.util.*;

public interface MatchRepository extends JpaRepository<CricketMatch, Long> {
    @EntityGraph(attributePaths = {"teamA", "teamB", "battingTeam", "bowlingTeam", "striker", "nonStriker", "bowler"})
    List<CricketMatch> findAllByOrderByScheduledAtDesc();

    @EntityGraph(attributePaths = {"teamA", "teamB", "battingTeam", "bowlingTeam", "striker", "nonStriker", "bowler"})
    List<CricketMatch> findByStatusOrderByScheduledAtDesc(MatchStatus status);

    @EntityGraph(attributePaths = {"teamA", "teamB", "battingTeam", "bowlingTeam", "striker", "nonStriker", "bowler"})
    @Query("select m from CricketMatch m where m.id = :id")
    Optional<CricketMatch> findDetailedById(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from CricketMatch m where m.id = :id")
    Optional<CricketMatch> findByIdForUpdate(@Param("id") Long id);

    List<CricketMatch> findByStatusAndSimulationEnabledTrue(MatchStatus status);
}
