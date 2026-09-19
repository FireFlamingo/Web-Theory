package com.cricpulse.repository;

import com.cricpulse.domain.PlayerMatchStat;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.*;

public interface PlayerMatchStatRepository extends JpaRepository<PlayerMatchStat, Long> {
    Optional<PlayerMatchStat> findByMatchIdAndPlayerId(Long matchId, Long playerId);

    @EntityGraph(attributePaths = "player")
    @Query("select s from PlayerMatchStat s where s.match.id = :matchId order by s.runs desc, s.wickets desc")
    List<PlayerMatchStat> findDetailedByMatchId(@Param("matchId") Long matchId);
}
