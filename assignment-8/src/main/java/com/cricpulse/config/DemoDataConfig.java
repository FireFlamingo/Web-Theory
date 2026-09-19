package com.cricpulse.config;

import com.cricpulse.api.ApiModels.*;
import com.cricpulse.domain.*;
import com.cricpulse.repository.*;
import com.cricpulse.service.MatchService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Configuration
public class DemoDataConfig {
    @Bean
    CommandLineRunner demoData(TeamRepository teams, PlayerRepository players, MatchService matches) {
        return args -> {
            if (teams.count() > 0) return;
            Team india = teams.save(new Team("India", "IND", "#3b82f6"));
            Team australia = teams.save(new Team("Australia", "AUS", "#f5c518"));
            Team england = teams.save(new Team("England", "ENG", "#ef4444"));
            Team southAfrica = teams.save(new Team("South Africa", "SA", "#22c55e"));
            addSquad(players, india, List.of("Rohit Sharma", "Shubman Gill", "Virat Kohli", "Suryakumar Yadav", "Rishabh Pant", "Hardik Pandya", "Ravindra Jadeja", "Kuldeep Yadav", "Jasprit Bumrah", "Mohammed Siraj", "Arshdeep Singh"));
            addSquad(players, australia, List.of("Travis Head", "David Warner", "Mitchell Marsh", "Glenn Maxwell", "Josh Inglis", "Marcus Stoinis", "Pat Cummins", "Mitchell Starc", "Adam Zampa", "Josh Hazlewood", "Nathan Ellis"));
            addSquad(players, england, List.of("Jos Buttler", "Phil Salt", "Will Jacks", "Harry Brook", "Liam Livingstone", "Moeen Ali", "Sam Curran", "Chris Woakes", "Adil Rashid", "Jofra Archer", "Mark Wood"));
            addSquad(players, southAfrica, List.of("Quinton de Kock", "Reeza Hendricks", "Aiden Markram", "Heinrich Klaasen", "David Miller", "Marco Jansen", "Keshav Maharaj", "Kagiso Rabada", "Anrich Nortje", "Tabraiz Shamsi", "Lungi Ngidi"));

            MatchDto live = matches.create(new CreateMatchRequest("India vs Australia", "T20", "Wankhede Stadium, Mumbai",
                    india.getId(), australia.getId(), 20, Instant.now().minus(25, ChronoUnit.MINUTES)));
            matches.start(live.id(), new StartMatchRequest(india.getId()));
            int[] opening = {1, 0, 4, 1, 2, 0, 6, 1, 1, 4, 0, 2, 1, 0, 4, 1, 1, 0};
            for (int run : opening) matches.score(live.id(), new ScoreRequest(run, false, "RUNS", null));

            matches.create(new CreateMatchRequest("England vs South Africa", "ODI", "The Oval, London",
                    england.getId(), southAfrica.getId(), 50, Instant.now().plus(2, ChronoUnit.HOURS)));
            matches.create(new CreateMatchRequest("Australia vs England", "T20", "Melbourne Cricket Ground",
                    australia.getId(), england.getId(), 20, Instant.now().plus(1, ChronoUnit.DAYS)));
        };
    }

    private void addSquad(PlayerRepository repository, Team team, List<String> names) {
        for (int i = 0; i < names.size(); i++) {
            PlayerRole role = i < 5 ? (i == 4 ? PlayerRole.WICKET_KEEPER : PlayerRole.BATTER)
                    : i < 7 ? PlayerRole.ALL_ROUNDER : PlayerRole.BOWLER;
            repository.save(new Player(names.get(i), role, team));
        }
    }
}
