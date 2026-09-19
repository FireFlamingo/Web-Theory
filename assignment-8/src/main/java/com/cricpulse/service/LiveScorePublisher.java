package com.cricpulse.service;

import com.cricpulse.api.ApiModels.MatchDto;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import java.io.IOException;
import java.util.*;
import java.util.concurrent.*;

@Service
public class LiveScorePublisher {
    private final Map<Long, CopyOnWriteArrayList<SseEmitter>> subscribers = new ConcurrentHashMap<>();

    public SseEmitter subscribe(Long matchId) {
        SseEmitter emitter = new SseEmitter(30L * 60 * 1000);
        subscribers.computeIfAbsent(matchId, ignored -> new CopyOnWriteArrayList<>()).add(emitter);
        Runnable remove = () -> remove(matchId, emitter);
        emitter.onCompletion(remove);
        emitter.onTimeout(remove);
        emitter.onError(error -> remove.run());
        try { emitter.send(SseEmitter.event().name("connected").data("ready")); }
        catch (IOException e) { remove.run(); }
        return emitter;
    }

    public void publish(MatchDto score) {
        var list = subscribers.getOrDefault(score.id(), new CopyOnWriteArrayList<>());
        for (SseEmitter emitter : list) {
            try { emitter.send(SseEmitter.event().name("score-update").id(String.valueOf(System.nanoTime())).data(score)); }
            catch (IOException | IllegalStateException e) { remove(score.id(), emitter); }
        }
    }

    public void heartbeat() {
        subscribers.forEach((matchId, list) -> list.forEach(emitter -> {
            try { emitter.send(SseEmitter.event().comment("keep-alive")); }
            catch (IOException | IllegalStateException e) { remove(matchId, emitter); }
        }));
    }

    private void remove(Long matchId, SseEmitter emitter) {
        var list = subscribers.get(matchId);
        if (list != null) {
            list.remove(emitter);
            if (list.isEmpty()) subscribers.remove(matchId);
        }
    }
}
