# LoL Champion Stats Dashboard

Desktop app for browsing League of Legends champions, stats, abilities, lore, and skins.

This repository is a monorepo with:

- `frontend/` - Electron + Vue desktop client (primary app)
- `backend/` - Spring Boot + PostgreSQL API (optional service for persisted champion data + proxy endpoints)

## Current Architecture

### Frontend runtime (what the desktop app uses today)

1. Electron starts a frameless desktop window with a custom title bar and window controls.
2. Vue/Pinia fetches champion version and champion data directly from Riot Data Dragon CDN.
3. Data is cached to disk via Electron IPC (`cache:get`, `cache:set`) for faster relaunch.
4. Champion detail pages load full champion payloads from Data Dragon using the selected version.

### Backend runtime (optional)

- Spring Boot exposes:
  - `/api/health`
  - `/api/champions` and `/api/champions/{riotId}` (PostgreSQL-backed data)
  - `/api/ddragon/...` compatibility/proxy endpoints
- Flyway migration creates the `champion` table.
- A scheduled sync service pulls Data Dragon champion summary data on startup and every 12 hours.

> Note: the current frontend no longer requires the backend to run.

## Tech Stack

| Layer | Tech |
|---|---|
| Desktop | Electron 42 |
| Frontend | Vue 3, Pinia, Vue Router, Vite |
| Styling | CSS variables + custom scrollbar + custom title bar |
| Backend | Spring Boot 3.5, Spring Web, Spring Data JPA, Flyway |
| Database | PostgreSQL |
| Build/Release | electron-builder + GitHub Actions + GitHub Releases |

## Features

- Champion grid with search and role filtering
- Champion detail view with:
  - base stats
  - passive + Q/W/E/R breakdown
  - cost/cooldown/range display
  - lore
  - skin carousel + loading screen preview popup
- Local champion cache persisted in Electron user data
- Custom frameless window controls (minimize/maximize/close)
- App launches maximized by default
- Custom dark scrollbar styling

## Project Structure

```text
frontend/
  electron/
    main.js              # BrowserWindow config, IPC handlers, cache file I/O
    preload.cjs          # Secure context bridge (electronAPI)
  src/
    api.js               # Data Dragon base URL
    stores/champions.js  # Pinia store: fetch, filter, cache logic
    views/
      HomeView.vue
      ChampionDetailView.vue
    components/
      TitleBar.vue
      ChampionCard.vue
    router/index.js
    assets/base.css
    assets/main.css
  public/garfield.ico
  vite.config.js
  package.json

backend/
  src/main/java/com/lolstats/backend/
    champion/            # Entity, repo, service, sync job, ddragon client/controllers
    config/HttpConfig.java
    health/HealthController.java
  src/main/resources/
    application.properties
    db/migration/V1__create_champion_table.sql
  pom.xml
```

## Prerequisites

### Frontend

- Node `^20.19.0 || >=22.12.0`
- npm

### Backend (optional)

- Java 21+
- Maven 3.8+
- PostgreSQL

## Run the Desktop App (recommended)

```powershell
cd frontend
npm install
npm run electron:dev
```

This is enough to run and use the app.

## Frontend Scripts

| Command | Purpose |
|---|---|
| `npm run electron:dev` | Start Vite + Electron in development |
| `npm run build` | Build Vue app into `dist/` |
| `npm run electron:build` | Build desktop installer/artifacts with electron-builder |
| `npm run lint` | Run oxlint + eslint |
| `npm run format` | Format frontend source files |

## Backend Setup (optional)

If you want to run the API/database service:

1. Create PostgreSQL database/user.
2. Set datasource env vars (or use defaults from `application.properties`):
   - `SPRING_DATASOURCE_URL` (default `jdbc:postgresql://localhost:5432/lolstats`)
   - `SPRING_DATASOURCE_USERNAME` (default `lol_user`)
   - `SPRING_DATASOURCE_PASSWORD` (default `lol_pass`)
   - `SPRING_JPA_HIBERNATE_DDL_AUTO` (default `validate`)
3. Run:

```powershell
cd backend
mvn spring-boot:run
```

Health check:

```powershell
curl http://localhost:8080/api/health
```

## Backend Endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/api/health` | GET | Health check |
| `/api/champions` | GET | List champions from DB |
| `/api/champions/{riotId}` | GET | Get one champion from DB |
| `/api/ddragon/api/versions.json` | GET | Data Dragon versions proxy |
| `/api/ddragon/cdn/{version}/data/en_US/champion.json` | GET | Champion summary proxy |
| `/api/ddragon/cdn/{version}/data/en_US/champion/{championId}.json` | GET | Champion detail proxy |

## Packaging and Local Builds

Build a distributable Windows package locally:

```powershell
cd frontend
npm install
npm run electron:build
```

Artifacts are generated in:

- `frontend/release/`

## GitHub Release Process (Automated)

This repo includes a tag-triggered workflow at `.github/workflows/build.yml`.

On `v*` tag push it will:

1. Install dependencies
2. Build frontend
3. Build Windows installer with electron-builder
4. Create/update GitHub Release for that tag
5. Upload release assets (`.exe`, `.blockmap`, `latest*.yml`)

### Release steps

```powershell
cd frontend
npm version 1.0.1 --no-git-tag-version
cd ..
git add frontend/package.json
git commit -m "Bump app version to 1.0.1"
git push
git tag v1.0.1
git push origin v1.0.1
```

## Troubleshooting

### App stuck on "Loading champions..."

- Confirm internet access to `https://ddragon.leagueoflegends.com`
- Open DevTools and check console for fetch errors

### Window controls not working

- Ensure app is running through Electron (`npm run electron:dev`), not plain Vite in browser
- Confirm `preload.cjs` exposes `window.electronAPI`

### GitHub Action builds but no Release appears

- Confirm workflow file is on default branch before pushing tag
- Confirm tag matches trigger pattern `v*`
- If reusing a tag, delete and recreate the tag before pushing again

### electron-builder icon errors

- Windows icon must include a 256x256 entry in `.ico`

## Security Notes

- Electron runs with `nodeIntegration: false` and `contextIsolation: true`
- Renderer only gets whitelisted APIs via `preload.cjs`
- No secrets are stored in frontend source

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Riot Games.
League of Legends and related assets are property of Riot Games, Inc.
Champion data is sourced from the public Data Dragon API.
