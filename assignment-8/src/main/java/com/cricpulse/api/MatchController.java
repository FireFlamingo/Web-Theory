package com.cricpulse.api;

import com.cricpulse.api.ApiModels.*;
import com.cricpulse.domain.MatchStatus;
import com.cricpulse.service.*;
import jakarta.validation.Valid;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MatchController {
    private final MatchService service;
    private final LiveScorePublisher publisher;

    public MatchController(MatchService service, LiveScorePublisher publisher) { this.service = service; this.publisher = publisher; }

    @GetMapping("/matches")
    public List<MatchDto> matches(@RequestParam(required = false) MatchStatus status) { return service.list(status); }

    @GetMapping("/matches/{id}")
    public MatchDto match(@PathVariable Long id) { return service.get(id); }

    @PostMapping("/matches")
    public ResponseEntity<MatchDto> create(@Valid @RequestBody CreateMatchRequest request) {
        MatchDto created = service.create(request);
        return ResponseEntity.created(URI.create("/api/matches/" + created.id())).body(created);
    }

    @PostMapping("/matches/{id}/start")
    public MatchDto start(@PathVariable Long id, @Valid @RequestBody StartMatchRequest request) { return service.start(id, request); }

    @PostMapping("/matches/{id}/score")
    public MatchDto score(@PathVariable Long id, @Valid @RequestBody ScoreRequest request) { return service.score(id, request); }

    @PostMapping("/matches/{id}/simulation")
    public MatchDto simulation(@PathVariable Long id, @RequestBody SimulationRequest request) { return service.setSimulation(id, request.enabled()); }

    @GetMapping(value = "/matches/{id}/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@PathVariable Long id) {
        service.get(id);
        return publisher.subscribe(id);
    }

    @GetMapping("/teams")
    public List<TeamDto> teams() { return service.listTeams(); }

    @GetMapping("/players")
    public List<PlayerDto> players(@RequestParam(required = false) Long teamId) { return service.listPlayers(teamId); }
}
