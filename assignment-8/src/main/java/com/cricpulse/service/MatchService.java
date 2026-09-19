package com.cricpulse.service;

import com.cricpulse.api.ApiModels.*;
import com.cricpulse.domain.*;
import com.cricpulse.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
public class MatchService {
    private final MatchRepository matches;
    private final TeamRepository teams;
    private final PlayerRepository players;
    private final PlayerMatchStatRepository stats;
    private final ScoreEventRepository events;
    private final LiveScorePublisher publisher;

    public MatchService(MatchRepository matches, TeamRepository teams, PlayerRepository players,
                        PlayerMatchStatRepository stats, ScoreEventRepository events, LiveScorePublisher publisher) {
        this.matches = matches; this.teams = teams; this.players = players;
        this.stats = stats; this.events = events; this.publisher = publisher;
    }

    @Transactional(readOnly = true)
    public List<MatchDto> list(MatchStatus status) {
        List<CricketMatch> result = status == null ? matches.findAllByOrderByScheduledAtDesc()
                : matches.findByStatusOrderByScheduledAtDesc(status);
        return result.stream().map(this::summaryDto).toList();
    }

    @Transactional(readOnly = true)
    public MatchDto get(Long id) { return fullDto(requireDetailed(id)); }

    @Transactional(readOnly = true)
    public List<TeamDto> listTeams() { return teams.findAll().stream().map(TeamDto::from).toList(); }

    @Transactional(readOnly = true)
    public List<PlayerDto> listPlayers(Long teamId) {
        List<Player> result = teamId == null ? players.findAll() : players.findByTeamIdOrderById(teamId);
        return result.stream().map(PlayerDto::from).toList();
    }

    @Transactional
    public MatchDto create(CreateMatchRequest request) {
        if (request.teamAId().equals(request.teamBId())) throw new InvalidMatchStateException("A match requires two different teams");
        Team a = requireTeam(request.teamAId()); Team b = requireTeam(request.teamBId());
        CricketMatch match = matches.save(new CricketMatch(request.title(), request.format(), request.venue(), a, b,
                request.maxOvers(), request.scheduledAt()));
        return fullDto(match);
    }

    @Transactional
    public MatchDto start(Long id, StartMatchRequest request) {
        CricketMatch match = requireForUpdate(id);
        if (match.getStatus() != MatchStatus.SCHEDULED) throw new InvalidMatchStateException("Only scheduled matches can be started");
        Team batting = requireTeam(request.battingTeamId());
        if (!batting.getId().equals(match.getTeamA().getId()) && !batting.getId().equals(match.getTeamB().getId()))
            throw new InvalidMatchStateException("Batting team must be part of this match");
        Team bowling = batting.getId().equals(match.getTeamA().getId()) ? match.getTeamB() : match.getTeamA();
        List<Player> batters = squad(batting.getId()); List<Player> bowlers = squad(bowling.getId());
        ensureSquads(batters, bowlers);
        match.start(batting, bowling, batters.get(0), batters.get(1), preferredBowler(bowlers, 0));
        MatchDto dto = fullDto(match);
        publisher.publish(dto);
        return dto;
    }

    @Transactional
    public MatchDto score(Long id, ScoreRequest request) {
        CricketMatch match = requireForUpdate(id);
        if (match.getStatus() != MatchStatus.LIVE) throw new InvalidMatchStateException("Scores can only be added to a live match");
        String type = request.eventType().trim().toUpperCase(Locale.ROOT);
        boolean legalBall = !type.equals("WIDE") && !type.equals("NO_BALL");
        Player facing = match.getStriker(); Player bowling = match.getBowler();
        match.recordBall(request.runs(), legalBall, request.wicket());

        int batterRuns = Set.of("WIDE", "BYE", "LEG_BYE").contains(type) ? 0 : request.runs();
        stat(match, facing).recordBatting(batterRuns, legalBall);
        stat(match, bowling).recordBowling(request.runs(), legalBall, request.wicket() && !type.equals("RUN_OUT"));

        String description = request.description() == null || request.description().isBlank()
                ? defaultDescription(facing, request.runs(), request.wicket(), type) : request.description().trim();
        events.save(new ScoreEvent(match, events.countByMatchId(id) + 1, request.runs(), request.wicket(), legalBall, type, description));

        if (request.wicket() && match.getWickets() < 10) {
            List<Player> battingSquad = squad(match.getBattingTeam().getId());
            match.setStriker(battingSquad.get(Math.min(match.getWickets() + 1, battingSquad.size() - 1)));
        } else if (request.runs() % 2 == 1) match.swapStrike();

        if (legalBall && match.getBalls() % 6 == 0) {
            match.swapStrike();
            List<Player> bowlingSquad = squad(match.getBowlingTeam().getId());
            match.setBowler(preferredBowler(bowlingSquad, match.getBalls() / 6));
        }
        finishOrAdvanceInnings(match);
        MatchDto dto = fullDto(match);
        publisher.publish(dto);
        return dto;
    }

    @Transactional
    public MatchDto setSimulation(Long id, boolean enabled) {
        CricketMatch match = requireForUpdate(id);
        if (match.getStatus() != MatchStatus.LIVE) throw new InvalidMatchStateException("Simulation is available only for live matches");
        match.setSimulationEnabled(enabled);
        MatchDto dto = fullDto(match); publisher.publish(dto); return dto;
    }

    private void finishOrAdvanceInnings(CricketMatch match) {
        boolean inningsFinished = match.getWickets() >= 10 || match.getBalls() >= match.getMaxOvers() * 6;
        if (match.getInningsNumber() == 1 && inningsFinished) {
            List<Player> nextBatters = squad(match.getBowlingTeam().getId());
            List<Player> nextBowlers = squad(match.getBattingTeam().getId());
            match.startSecondInnings(nextBatters.get(0), nextBatters.get(1), preferredBowler(nextBowlers, 0));
            return;
        }
        if (match.getInningsNumber() == 2 && match.getTarget() != null && match.getRuns() >= match.getTarget()) {
            match.complete(match.getBattingTeam().getName() + " won by " + (10 - match.getWickets()) + " wickets");
        } else if (match.getInningsNumber() == 2 && inningsFinished) {
            int first = match.getFirstInningsRuns();
            if (match.getRuns() == first) match.complete("Match tied");
            else match.complete(match.getBowlingTeam().getName() + " won by " + (first - match.getRuns()) + " runs");
        }
    }

    private PlayerMatchStat stat(CricketMatch match, Player player) {
        return stats.findByMatchIdAndPlayerId(match.getId(), player.getId())
                .orElseGet(() -> stats.save(new PlayerMatchStat(match, player)));
    }
    private Team requireTeam(Long id) { return teams.findById(id).orElseThrow(() -> new NotFoundException("Team " + id + " was not found")); }
    private CricketMatch requireDetailed(Long id) { return matches.findDetailedById(id).orElseThrow(() -> new NotFoundException("Match " + id + " was not found")); }
    private CricketMatch requireForUpdate(Long id) { return matches.findByIdForUpdate(id).orElseThrow(() -> new NotFoundException("Match " + id + " was not found")); }
    private List<Player> squad(Long teamId) { return players.findByTeamIdOrderById(teamId); }
    private void ensureSquads(List<Player> batters, List<Player> bowlers) {
        if (batters.size() < 2 || bowlers.isEmpty()) throw new InvalidMatchStateException("Both teams need registered players before the match can start");
    }
    private Player preferredBowler(List<Player> squad, int over) {
        List<Player> specialists = squad.stream().filter(p -> p.getRole() == PlayerRole.BOWLER || p.getRole() == PlayerRole.ALL_ROUNDER).toList();
        List<Player> pool = specialists.isEmpty() ? squad : specialists;
        return pool.get(over % pool.size());
    }
    private String defaultDescription(Player batter, int runs, boolean wicket, String type) {
        if (wicket) return "WICKET! " + batter.getName() + " is dismissed";
        if (type.equals("WIDE")) return "Wide ball, " + runs + " extra" + (runs == 1 ? "" : "s");
        return switch (runs) { case 0 -> batter.getName() + " defends — dot ball"; case 4 -> batter.getName() + " finds the boundary!"; case 6 -> batter.getName() + " launches it for six!"; default -> batter.getName() + " takes " + runs + " run" + (runs == 1 ? "" : "s"); };
    }

    private MatchDto summaryDto(CricketMatch m) { return toDto(m, List.of(), List.of()); }
    private MatchDto fullDto(CricketMatch m) {
        List<PlayerStatDto> playerStats = stats.findDetailedByMatchId(m.getId()).stream().map(this::statDto).toList();
        List<EventDto> recent = events.findTop12ByMatchIdOrderBySequenceNumberDesc(m.getId()).stream().map(this::eventDto).toList();
        return toDto(m, playerStats, recent);
    }
    private MatchDto toDto(CricketMatch m, List<PlayerStatDto> playerStats, List<EventDto> recent) {
        InningsDto first = m.getFirstInningsRuns() == null ? null : new InningsDto(1, TeamDto.from(m.getBowlingTeam()),
                m.getFirstInningsRuns(), m.getFirstInningsWickets(), m.getFirstInningsBalls(), overs(m.getFirstInningsBalls()));
        return new MatchDto(m.getId(), m.getTitle(), m.getFormat(), m.getVenue(), m.getStatus(), TeamDto.from(m.getTeamA()),
                TeamDto.from(m.getTeamB()), TeamDto.from(m.getBattingTeam()), TeamDto.from(m.getBowlingTeam()),
                PlayerDto.from(m.getStriker()), PlayerDto.from(m.getNonStriker()), PlayerDto.from(m.getBowler()),
                m.getInningsNumber(), m.getRuns(), m.getWickets(), m.getBalls(), overs(m.getBalls()), m.getTarget(),
                m.getMaxOvers(), m.isSimulationEnabled(), m.getResult(), m.getScheduledAt(), m.getStartedAt(), m.getUpdatedAt(),
                first, playerStats, recent);
    }
    private PlayerStatDto statDto(PlayerMatchStat s) {
        double rate = s.getBallsFaced() == 0 ? 0 : Math.round(s.getRuns() * 10000.0 / s.getBallsFaced()) / 100.0;
        return new PlayerStatDto(PlayerDto.from(s.getPlayer()), s.getRuns(), s.getBallsFaced(), s.getFours(), s.getSixes(),
                rate, s.getWickets(), s.getBallsBowled(), s.getRunsConceded(), overs(s.getBallsBowled()));
    }
    private EventDto eventDto(ScoreEvent e) { return new EventDto(e.getId(), e.getSequenceNumber(), e.getInningsNumber(), e.getOverNumber(), e.getBallNumber(), e.getRuns(), e.isWicket(), e.isLegalBall(), e.getEventType(), e.getDescription(), e.getCreatedAt()); }
    public static String overs(int balls) { return (balls / 6) + "." + (balls % 6); }
}
