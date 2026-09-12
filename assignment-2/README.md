# Assignment 2 — Clock Dashboard

A Vite + React clock dashboard, containerized with Docker.

## Project structure

```
assignment-2/
└── clock-dashboard/
    ├── src/                 # React source
    ├── public/              # static assets
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── Dockerfile           # multi-stage: Node build → nginx serve
    ├── nginx.conf           # SPA routing + static caching
    ├── docker-compose.yml   # maps host 8080 → container 80
    └── .dockerignore
```

## Run locally (Node)

```bash
cd clock-dashboard
npm install        # install dependencies
npm run dev        # start dev server (http://localhost:5173)
npm run build      # production build → dist/
npm run preview    # preview the production build
npm run lint       # run oxlint
```

## Run with Docker

All commands are run from inside the `clock-dashboard/` folder.

```bash
# Build and start (detached), then open http://localhost:8080
docker compose up --build -d

# View logs
docker compose logs -f

# Stop and remove the container
docker compose down

# Start again without rebuilding
docker compose up -d

# Rebuild after code changes
docker compose up --build
```

### Plain Docker (without compose)

```bash
# Build the image
docker build -t clock-dashboard ./clock-dashboard

# Run it, mapping host 8080 → container 80
docker run -p 8080:80 clock-dashboard
```

The app is served at **http://localhost:8080**.
