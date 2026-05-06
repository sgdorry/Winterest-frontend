# Winterest Frontend

A geography guessing game where players identify countries, states, and cities using progressive hints. Compete with friends on leaderboards and track your stats.

## Tech Stack

- **React 19** with React Router DOM 7
- **Vite 7** for development and builds
- **Vitest** + Testing Library for tests
- **Context API** for auth state management
- **Native Fetch API** for HTTP requests

## Project Structure

```
src/
├── api/                   # Backend API integration
│   ├── client.js          # Base URL config (reads VITE_API_BASE_URL)
│   ├── users.js           # Auth endpoints (signup, login, updateUsername)
│   ├── scores.js          # Score submission & leaderboard queries
│   ├── friends.js         # Friend management (add, remove, list)
│   ├── geo.js             # Geographic data (countries, states, cities, counties)
│   ├── quiz.js            # Quiz question fetching
│   └── puzzles.js         # Puzzle data fetching
├── pages/                 # Page-level components
│   ├── Title.jsx          # Landing page (conditional on auth state)
│   ├── Login.jsx          # Email/password login
│   ├── Signup.jsx         # Registration (email, username, password)
│   ├── GamePage.jsx       # Game mode selection & orchestration
│   ├── Rules.jsx          # How-to-play guide with scoring table
│   ├── Leaderboard.jsx    # Friend-based leaderboard with period filters
│   ├── Profile.jsx        # User stats, friend management, username editing
│   └── FlagQuiz.jsx       # Flag quiz feature
├── components/            # Reusable components
│   ├── Game.jsx           # Core game logic (5 guesses, hints, scoring)
│   ├── HintCard.jsx       # Hint display card
│   └── Navbar/            # Top navigation bar
├── context/
│   └── AuthContext.jsx    # Global auth state (user, login, logout, updateUser)
├── tests/                 # Unit tests
│   └── testSetup.js       # localStorage mock & test config
├── main.jsx               # React root (BrowserRouter + AuthProvider)
└── App.jsx                # Route definitions
```

## Routes

| Path | Component | Auth Required | Description |
|------|-----------|---------------|-------------|
| `/` | Title | No | Landing page |
| `/login` | Login | No | Login form |
| `/signup` | Signup | No | Registration form |
| `/home` | Title | No | Home (with navbar) |
| `/play` | GamePage | Yes* | Game mode selection |
| `/leaderboard` | Leaderboard | Yes* | Friend leaderboard |
| `/how-to-play` | Rules | No | Game rules |
| `/flag-quiz` | FlagQuiz | No | Flag quiz |
| `/profile` | Profile | Yes* | User profile & stats |

*These pages render differently or limit functionality when not logged in.

## Game Flow

1. Player selects a game mode on `/play` (Countries, States, or Cities)
2. `Game.jsx` loads a random entity with 5 progressive hints
3. Player guesses via dropdown or text input — max 5 attempts
4. Score = `(5 - guessesUsed) * 100` (range: 0–500)
5. On game end, score is submitted to the backend if user is logged in

## Auth Flow

- **Signup**: POST `/signup` → validates username (alphanumeric + underscore), email, password → redirects to login
- **Login**: POST `/login` → returns user object → stored in `AuthContext` + `localStorage`
- **Persistence**: On page reload, `AuthContext` reads user from `localStorage`
- **Logout**: Clears `localStorage` and context, redirects to `/`


**Base URL**: `http://127.0.0.1:8000` (local dev)

### Backend Tech Stack

- Python 3.13+ / Flask 2.3 / Flask-RESTX
- MongoDB (local or Atlas)
- bcrypt for password hashing
- In-memory caching with `@needs_cache` decorator

### Backend Structure

```
Winterest/
├── server/endpoints.py        # All Flask-RESTX route definitions
├── data/db_connect.py         # MongoDB connection, generic CRUD, retry logic
├── users/queries_users.py     # User CRUD, auth, password hashing
├── scores/queries_scores.py   # Score tracking & aggregation
├── friends/queries_friends.py # Bidirectional friend relationships
├── countries/                 # Country CRUD + hint builder
│   ├── queries_countries.py
│   └── hints.py
├── states/                    # State CRUD + hint builder
│   ├── queries_states.py
│   └── hints.py
├── cities/                    # City CRUD + hint builder
│   ├── queries_cities.py
│   └── hints.py
├── counties/                  # County CRUD
├── prompts/                   # Quiz prompt management
├── puzzles/                   # Puzzle management
├── security/                  # API key auth & ACL framework
├── seed/seed_data.json        # Initial game data
├── scripts/load_script.py     # DB seeding script
└── .github/workflows/main.yml # CI/CD
```

### Key API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/signup` | Register `{email, username, password}` |
| POST | `/login` | Authenticate `{email, password}` |
| PUT | `/users/username` | Update username `{user_id, username}` |
| GET | `/countries` | All countries with computed hints |
| GET | `/states` | All states with computed hints |
| GET | `/cities` | All cities with computed hints |
| GET | `/scores` | All scores (sorted desc) |
| POST | `/scores` | Submit score `{user_id, player, score, guesses_used, entity_type}` |
| GET | `/scores/aggregated?period=all\|week\|month` | Leaderboard |
| GET | `/friends?user_id=` | Friend list |
| POST | `/friends` | Add friend `{user_id, friend_email}` |
| DELETE | `/friends` | Remove friend `{user_id, friend_id}` |
| GET | `/scores/friends?user_id=` | Scores for user + friends |
| GET | `/scores/friends/aggregated?user_id=&period=` | Friend group leaderboard |

### Database Collections (MongoDB — `seDB`)

- **users**: `{id, email, username, password (bcrypt), friends[], score, games_played}`
- **scores**: `{id, user_id, player, score, guesses_used, entity_type, timestamp}`
- **friends**: `{id, user_id, friend_id}` (bidirectional — two records per friendship)
- **countries**: `{country_id, name, population, continent, capital, gdp, area, ...}`
- **states**: `{id, name, state_code, population, capital, area, governor, ...}`
- **cities**: `{id, name, state, state_code, population, area, mayor, nickname, ...}`

## Getting Started

### Prerequisites

- Node.js 20+
- Python 3.13+
- MongoDB 7 (local) or a MongoDB Atlas account

### Backend Setup

```bash
cd ../Winterest
make setup          # Creates venv, installs deps, starts MongoDB, seeds data
make start          # Runs Flask on http://127.0.0.1:8000
```

### Frontend Setup

```bash
npm install
npm run dev         # Starts Vite dev server at http://localhost:5173
```

## Scripts

### Frontend

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run coverage` | Run tests with coverage report |

### Backend

| Command | Description |
|---------|-------------|
| `make setup` | Full first-time setup |
| `make start` | Run dev server on port 8000 |
| `make seed` | Re-seed database from `seed_data.json` |
| `make all_tests` | Lint (flake8) + pytest across all modules |
| `make dev_env` | Create venv + install deps (used in CI) |
| `make clean` | Remove `.venv/` |

## CI/CD

Both repos use **GitHub Actions** triggered on push/PR to `master`:

**Frontend** (`.github/workflows/main.yml`):
1. Checkout → Install (Node 20) → Lint → Test → Build

**Backend** (`.github/workflows/main.yml`):
1. Checkout → Setup Python 3.13 → Start MongoDB 7 → Install deps → Lint + Test

## Deployment

- **Backend**: Hosted on PythonAnywhere (`winterestjesma.pythonanywhere.com`). Deploy via `make prod` or `./deploy.sh`.
- **Frontend**: Build with `npm run build`, deploy the `dist/` folder to any static host. Set `VITE_API_BASE_URL` to the production backend URL.
