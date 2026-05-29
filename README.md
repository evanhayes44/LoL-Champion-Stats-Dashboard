# LoL Champion Stats Dashboard

A desktop application for browsing League of Legends champion stats, abilities, and lore. Built with Electron and Vue 3 as a portfolio project targeting a Software Engineer role at Riot Games.

## Features

- Browse all 170+ champions with portraits, titles, and role tags
- Live search filtering as you type
- Role filter dropdown (Assassin, Fighter, Mage, Marksman, Support, Tank)
- Champion detail view with base stats and full lore
- Ability viewer with icons, slot labels (Passive/Q/W/E/R), cooldowns, costs, and ranges per rank
- Ability descriptions with damage-type color coding
- Local disk cache for instant load on relaunch
- Dark theme styled to match Riot's design

## Tech Stack

| Layer | Technology |
|---|---|
| Desktop shell | Electron 42 |
| Frontend framework | Vue 3 (Composition API) |
| State management | Pinia |
| Routing | Vue Router |
| Build tool | Vite |
| Data source | Riot Data Dragon CDN |

## Architecture

The app follows Electron's two-process model:

- **Main process** (`electron/main.js`) — creates the OS window, manages the champion data cache on disk via IPC handlers
- **Preload script** (`electron/preload.cjs`) — exposes a minimal, typed API to the renderer via `contextBridge`
- **Renderer process** (`src/`) — Vue 3 SPA handling all UI, routing, and data fetching

Security practices applied:
- `nodeIntegration: false` and `contextIsolation: true`
- Content Security Policy restricting scripts, styles, images, and network requests
- IPC communication via `contextBridge` with an explicitly whitelisted API surface

## Project Structure

```
electron/
  main.js         # Main process — window creation, IPC, disk cache
  preload.cjs     # Context bridge — exposes electronAPI to renderer

src/
  stores/
    champions.js  # Pinia store — fetches, caches, and filters champion data
  views/
    HomeView.vue            # Champion grid with live search
    ChampionDetailView.vue  # Stats, abilities, and lore for one champion
  components/
    ChampionCard.vue        # Reusable card component used in the grid
  assets/
    base.css      # Design tokens — colors, typography, spacing variables
    main.css      # Global layout and utility classes
```

## Running Locally

```sh
npm install
npm run electron:dev
```

## Data Source

Champion data is fetched from [Riot Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon), Riot's static CDN for League of Legends game data. No API key is required.

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Riot Games. League of Legends and all related assets are the property of Riot Games, Inc. Champion data is sourced from the publicly available Data Dragon API.