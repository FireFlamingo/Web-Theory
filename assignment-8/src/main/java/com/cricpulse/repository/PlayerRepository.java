package com.cricpulse.repository;

import com.cricpulse.domain.Player;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PlayerRepository extends JpaRepository<Player, Long> {
    List<Player> findByTeamIdOrderById(Long teamId);
}
