# LoL Champion Stats Dashboard

A full-stack desktop application for browsing League of Legends champion stats, abilities, and lore. Built as a job-ready portfolio project combining Electron + Vue frontend with Spring Boot backend and PostgreSQL database.

## Architecture

This is a monorepo containing both frontend and backend:

```
frontend/        # Electron + Vue 3 desktop application
backend/         # Spring Boot REST API
```

### Technology Stack

| Layer | Technology |
|---|---|
| **Desktop Shell** | Electron 42 |
| **Frontend** | Vue 3 (Composition API), Pinia, Vue Router, Vite |
| **Backend API** | Spring Boot 3.x, Spring Web, Spring Data JPA |
| **Database** | PostgreSQL 15+ |
| **Migrations** | Flyway |
| **Data Source** | Riot Data Dragon CDN (synced to DB) |
| **Java Version** | Java 21 |

### System Design

```
┌─────────────────────────┐
│   Electron/Vue          │
│   (Desktop App)         │
└────────────┬────────────┘
             │ HTTP
             ▼
┌─────────────────────────┐
│   Spring Boot API       │
│   (REST Endpoints)      │
└────────────┬────────────┘
             │ JDBC
             ▼
┌─────────────────────────┐
│   PostgreSQL Database   │
└─────────────────────────┘
             ▲
             │ HTTP (Scheduled sync)
             │
┌─────────────────────────┐
│   Riot Data Dragon CDN  │
└─────────────────────────┘
```

**Data Flow:**
1. Backend scheduled task syncs champion data from Riot Data Dragon on startup and at intervals
2. Frontend calls backend REST API instead of fetching directly from Riot
3. Backend queries PostgreSQL and returns formatted JSON responses
4. Frontend caches data locally and renders in Electron window

## Backend Setup (Spring Boot)

### Prerequisites
- Java 21+
- PostgreSQL 15+
- Maven 3.8+

### Local Database Setup

1. **Create PostgreSQL database:**
```sql
CREATE DATABASE lol_dashboard;
CREATE USER lol_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lol_dashboard TO lol_user;
```

2. **Configure backend connection:**
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lol_dashboard
spring.datasource.username=lol_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQL15Dialect
```

### Running Backend

```sh
cd backend
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

**Health check:** `curl http://localhost:8080/api/health`

### API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/health` | GET | Service health check |
| `/api/champions` | GET | List all champions with pagination |
| `/api/champions/{riotId}` | GET | Get single champion details |
| `/api/data-dragon/versions` | GET | Get available Data Dragon versions |
| `/api/data-dragon/champion-data` | GET | Get champion list from Data Dragon CDN (proxy) |
| `/api/data-dragon/champion/{riotId}` | GET | Get champion details from Data Dragon CDN (proxy) |

## Frontend Setup (Electron + Vue)

### Prerequisites
- Node 18+
- npm 9+

### Running Frontend

```sh
cd frontend
npm install
npm run electron:dev
```

Application opens as an Electron window and fetches data from `http://localhost:8080/api`.

## Features

- **Champion Browser** — Browse 170+ champions with portraits, titles, and role tags
- **Live Search** — Filter champions as you type
- **Role Filtering** — Filter by Assassin, Fighter, Mage, Marksman, Support, Tank
- **Champion Details** — View base stats, abilities (with cooldowns and costs), and lore
- **Skin Viewer** — Scrollable skin carousel with loading screen art preview
- **Auto-Cache Sync** — Automatically checks for Data Dragon updates and syncs new champion data
- **Local Caching** — Instant load on relaunch via disk cache
- **Dark Theme** — UI styled to match Riot's visual identity

## Project Structure

### Frontend
```
frontend/
├── electron/
│   ├── main.js              # Electron main process - window creation, IPC
│   └── preload.cjs          # Context bridge - securely exposes APIs
├── src/
│   ├── stores/
│   │   └── champions.js     # Pinia store - data fetching, filtering
│   ├── views/
│   │   ├── HomeView.vue     # Champion grid with search
│   │   └── ChampionDetailView.vue  # Champion details + abilities
│   ├── components/
│   │   ├── ChampionCard.vue # Reusable champion card
│   │   └── SkinCarousel.vue # Skin carousel component
│   ├── assets/
│   │   ├── base.css         # Design tokens
│   │   └── main.css         # Global styles
│   └── App.vue
├── package.json
└── vite.config.js
```

### Backend
```
backend/
├── src/main/java/com/LoLDashboard/
│   ├── LoLDashboardApplication.java  # Spring Boot entry point
│   ├── entity/
│   │   └── Champion.java             # JPA entity - maps to champions table
│   ├── repository/
│   │   └── ChampionRepository.java    # Spring Data - DB queries
│   ├── service/
│   │   ├── ChampionService.java       # Business logic
│   │   └── DataDragonSyncService.java # Scheduled sync from Riot
│   ├── controller/
│   │   ├── ChampionController.java    # REST endpoints
│   │   └── DataDragonProxyController.java # Data Dragon CDN proxy
│   └── config/
│       └── SchedulerConfig.java       # Task scheduling setup
├── src/main/resources/
│   ├── application.properties         # Database & app config
│   └── db/migration/
│       └── V1__initial_schema.sql     # Flyway migration
├── pom.xml
└── mvn clean install
```

## How Data Flows

### Initial Startup
1. Spring Boot starts and runs all Flyway migrations (creates tables)
2. `DataDragonSyncService` fetches latest champion data from Riot CDN
3. Data is parsed and inserted into PostgreSQL `champions` table
4. Frontend requests `/api/champions` and renders data

### Champion Updates
1. Backend scheduled task checks Data Dragon for new versions every 30 minutes
2. If new version detected, fetches updated champion list
3. Upserts champions into database (updates existing, adds new)
4. Frontend polls or is notified of updates
5. Auto-refreshes UI with new champion data (e.g., new skins)

### Frontend → Backend Call
```javascript
// Frontend (Composition API)
const champions = await fetch('http://localhost:8080/api/champions').then(r => r.json());
```

```java
// Backend (Spring REST)
@GetMapping("/champions")
public ResponseEntity<List<ChampionResponse>> getAllChampions() {
    return ResponseEntity.ok(championService.getAllChampions());
}
```

## Database Schema

### Champions Table
```sql
CREATE TABLE champions (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    riot_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    lore TEXT,
    resource_type VARCHAR(50),
    attack_range DOUBLE PRECISION,
    hp DOUBLE PRECISION,
    mp DOUBLE PRECISION,
    move_speed DOUBLE PRECISION,
    armor DOUBLE PRECISION,
    magic_resist DOUBLE PRECISION,
    hp_regen DOUBLE PRECISION,
    mp_regen DOUBLE PRECISION,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

Additional columns store skins, abilities, and stats as JSON blobs for flexibility.

## Building & Deployment

### Development
```sh
# Backend
cd backend && mvn spring-boot:run

# Frontend (in new terminal)
cd frontend && npm run electron:dev
```

### Production Frontend Build
```sh
cd frontend
npm run build:electron
```

Generates standalone Electron executable in `dist/`.

### Backend Deployment
Package as Docker container or deploy JAR:
```sh
cd backend
mvn clean package -DskipTests
java -jar target/lol-dashboard-*.jar
```

## Security & Best Practices

### Frontend
- Electron security hardening: `nodeIntegration: false`, `contextIsolation: true`
- Content Security Policy restricting external scripts/styles
- IPC communication via explicit whitelist
- No sensitive credentials in frontend code

### Backend
- Spring Security ready (pre-configured but not yet required)
- SQL injection prevention via parameterized queries (JPA)
- CORS configured for frontend origin
- Validation on all inputs (JSR-380)
- Global exception handling with structured error responses

## Common Issues & Solutions

### Images Not Loading
- Ensure backend is running (`http://localhost:8080` is reachable)
- Check CORS configuration in backend `application.properties`
- Verify image URLs point to Data Dragon CDN: `https://ddragon.leagueoflegends.com/cdn/...`

### Champions Not Appearing
- Verify PostgreSQL is running and database connection works
- Check backend logs: `mvn spring-boot:run` should show SQL queries
- Confirm Flyway migration ran: `SELECT * FROM champions;` in psql

### Cache Not Updating
- Backend scheduled task runs every 30 minutes on startup
- Force sync by restarting backend
- Check server logs for Data Dragon fetch errors

### Database Connection Errors
- Verify PostgreSQL is running: `psql -U postgres`
- Check credentials in `application.properties` match your DB
- Ensure database `lol_dashboard` exists

## Learning Resources

This project demonstrates:
- **Spring Boot fundamentals** — REST API design, dependency injection, configuration
- **Spring Data JPA** — ORM mapping, repository pattern, queries
- **Scheduled tasks** — Async data syncing from external APIs
- **Electron + Vue integration** — Desktop app with HTTP backend
- **Database design** — Schema migrations, relationships, constraints
- **API design patterns** — RESTful endpoints, response formatting, pagination

## Disclaimer

This project is not affiliated with, endorsed by, or sponsored by Riot Games. League of Legends and all related assets are the property of Riot Games, Inc. Champion data is sourced from the publicly available Data Dragon API.