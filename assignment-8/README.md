# CricPulse

CricPulse is a full-stack, real-time cricket score management system built with Spring Boot. It stores fixtures and scorecards in H2, exposes a REST API, pushes live updates with Server-Sent Events (SSE), and serves a responsive match-centre dashboard.

## Features

- Live ball-by-ball scoring with runs, wides, wickets, strike rotation, overs, and innings transitions
- Automatic target/result calculation for two-innings limited-overs matches
- Per-player batting and bowling statistics
- Start/pause match simulation (one delivery every 3.5 seconds)
- Real-time browser updates over SSE with reconnect support
- Create and start fixtures from the dashboard
- Transactional score writes, pessimistic locking, optimistic entity versioning, validation, and structured API errors
- Seeded teams, players, one live match, and upcoming fixtures

## Run

Requires Java 21 or newer.

```powershell
.\mvnw.cmd spring-boot:run
```

Open <http://localhost:8080>. The H2 console is available at <http://localhost:8080/h2-console> using JDBC URL `jdbc:h2:mem:cricpulse`, user `sa`, and a blank password.

For a persistent or multi-instance deployment, point the app at PostgreSQL with `DB_URL`, `DB_USERNAME`, and `DB_PASSWORD`; set `H2_CONSOLE_ENABLED=false` and manage schema changes with `DDL_AUTO=validate` in production.

Run the tests with:

```powershell
.\mvnw.cmd test
```

## API

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/matches?status=LIVE` | List matches, optionally filtered |
| `GET` | `/api/matches/{id}` | Match scorecard, stats, and recent events |
| `POST` | `/api/matches` | Create a fixture |
| `POST` | `/api/matches/{id}/start` | Start a scheduled match |
| `POST` | `/api/matches/{id}/score` | Record a delivery |
| `POST` | `/api/matches/{id}/simulation` | Enable or pause simulation |
| `GET` | `/api/matches/{id}/stream` | Subscribe to the SSE live feed |
| `GET` | `/api/teams` | List teams |
| `GET` | `/api/players?teamId=1` | List players |

Example delivery:

```json
{
  "runs": 4,
  "wicket": false,
  "eventType": "RUNS",
  "description": "Driven through extra cover"
}
```

`eventType` accepts normal scoring labels such as `RUNS`, `WIDE`, `NO_BALL`, `BYE`, `LEG_BYE`, or `RUN_OUT`. Wides and no-balls do not increment the legal-ball count.

## Architecture

```text
Responsive dashboard ──REST──> MatchController ──> MatchService ──> JPA / H2
         ^                                        │
         └──────────── SSE score-update events ───┘
                                                  ^
                         scheduled simulator ─────┘
```
