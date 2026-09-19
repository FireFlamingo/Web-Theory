package com.cricpulse.api;

import com.cricpulse.domain.*;
import jakarta.validation.constraints.*;
import java.time.Instant;
import java.util.List;

public final class ApiModels {
    private ApiModels() {}

    public record TeamDto(Long id, String name, String shortName, String color) {
        public static TeamDto from(Team t) { return t == null ? null : new TeamDto(t.getId(), t.getName(), t.getShortName(), t.getColor()); }
    }
    public record PlayerDto(Long id, String name, PlayerRole role, Long teamId) {
        public static PlayerDto from(Player p) { return p == null ? null : new PlayerDto(p.getId(), p.getName(), p.getRole(), p.getTeam().getId()); }
    }
    public record InningsDto(int number, TeamDto battingTeam, int runs, int wickets, int balls, String overs) {}
    public record MatchDto(Long id, String title, String format, String venue, MatchStatus status,
                           TeamDto teamA, TeamDto teamB, TeamDto battingTeam, TeamDto bowlingTeam,
                           PlayerDto striker, PlayerDto nonStriker, PlayerDto bowler,
                           int inningsNumber, int runs, int wickets, int balls, String overs,
                           Integer target, int maxOvers, boolean simulationEnabled, String result,
                           Instant scheduledAt, Instant startedAt, Instant updatedAt,
                           InningsDto firstInnings, List<PlayerStatDto> playerStats, List<EventDto> recentEvents) {}
    public record PlayerStatDto(PlayerDto player, int runs, int ballsFaced, int fours, int sixes,
                                double strikeRate, int wickets, int ballsBowled, int runsConceded, String overs) {}
    public record EventDto(Long id, long sequence, int innings, int over, int ball, int runs,
                           boolean wicket, boolean legalBall, String type, String description, Instant createdAt) {}

    public record CreateMatchRequest(@NotBlank @Size(max=120) String title, @NotBlank @Size(max=20) String format,
                                     @NotBlank @Size(max=120) String venue,
                                     @NotNull Long teamAId, @NotNull Long teamBId,
                                     @Min(1) @Max(50) int maxOvers, @NotNull Instant scheduledAt) {}
    public record StartMatchRequest(@NotNull Long battingTeamId) {}
    public record ScoreRequest(@Min(0) @Max(7) int runs, boolean wicket,
                               @NotBlank @Size(max=40) String eventType, @Size(max=240) String description) {}
    public record SimulationRequest(boolean enabled) {}
    public record ApiError(Instant timestamp, int status, String error, String message, String path,
                           java.util.Map<String, String> validationErrors) {}
}
