# Telemetry Monitor

A Windows desktop app (Angular + Electron) that shows live telemetry for Velocity, Pressure and Temperature. A Node.js backend simulates an embedded controller.

## Tech stack

| Part | Technology |
|---|---|
| Frontend | Angular 22, TypeScript, SCSS, Angular Material |
| Charts | Chart.js, ng2-charts, chartjs-plugin-zoom |
| Export | SheetJS (xlsx), file-saver |
| Backend | Node.js, Express, cors, dotenv |
| Desktop | Electron, electron-builder |

## Folder structure

```
telemetry-monitor/
├── backend/    Node + Express API with the simulation
├── frontend/   Angular dashboard
├── desktop/    Electron shell and installer config
└── README.md
```

## Requirements

- Node.js 20 or newer
- Angular CLI: `npm install -g @angular/cli`
- Windows 10 or 11 (to build and run the installer)

## Setup

Run once in each folder:

```
cd backend && npm install
cd ../frontend && npm install
cd ../desktop && npm install
```

Create `backend/.env` with this line (see `backend/.env.example`):

```
PORT=3000
```

## Run in development

Open three terminals:

1. `backend`: `npm run dev`
2. `frontend`: `ng serve`
3. `desktop`: `npm run dev`

An app window opens with the dashboard. You can also open `http://localhost:4200` in a browser.

## Run the built app without installing

Close the backend and `ng serve` terminals first, because the app starts its own backend. Then, in `desktop`:

```
npm run build:frontend
npm run start:build
```

## Build the Windows installer

In `desktop`:

```
npm run build:frontend
npm run pack
```

The installer is created in `desktop/release/`. The installed app starts its own backend, so no terminal is needed.

## API

`GET /api/dashboard` returns:

```
{
  "timestamp": "2026-07-22T15:10:05Z",
  "velocity":    { "value": 185.4, "unit": "cm/s", "history": [ { "time": "15:10:05", "value": 185.4 } ] },
  "pressure":    { "value": 1012,  "unit": "mbar", "history": [ ... ] },
  "temperature": { "value": 36.8,  "unit": "°C",   "history": [ ... ] }
}
```

`GET /api/health` returns `{ "status": "ok" }`.

## Simulation rules (backend)

- A new sample is created every 1 second, forever.
- Each tick moves every value up or down at random by 1 to 3% of its base value.
- A value never goes more than 10% away from its base value.
- After every 5 ticks, the value moves half of the way back to its base value.
- The latest 100 samples are kept for each parameter (in memory).

Base values: velocity 185.4 cm/s, pressure 1012 mbar, temperature 36.8 °C.

## Features

- Circular gauge, current value, unit, status and last updated time for each parameter
- Live trend chart (latest 100 samples) with zoom, pan and tooltips (time, value, unit)
- Data is fetched every second, with loading, error and connection states
- Unit conversion at runtime, done in the browser with no extra backend request
- Light and dark theme, switched without reload and remembered after restart
- Export to CSV and Excel with timestamps and all parameters

## Architecture and technical decisions

- **Backend is split into small files:** config (numbers), store (keeps the latest 100 samples), simulation (creates new values), and routes/controllers (serve the data).
- **No database:** the task only needs the latest 100 samples, so they live in memory. A database would add setup with no benefit.
- **Backend always sends base units** (cm/s, mbar, °C). The frontend converts, so changing a unit needs no backend request and is instant.
- **Frontend services hold the logic:** `TelemetryService` (polling and states), `UnitConversionService`, `ThemeService`, `ExportService`. Components only show data.
- **Polling with a timer:** a request is skipped if the previous one is still running. If the backend is down, the timer keeps going, so the app reconnects on its own.
- **Angular signals** hold the data and states, so the screen updates automatically.
- **Smooth charts:** chart animation is off and the chart is updated in place, so there is no flicker. The gauge uses a CSS transition.
- **Gauge is a custom SVG,** so there is no dependency on a gauge package.
- **Themes use CSS variables,** so switching needs no reload.
- **Electron in production** starts the backend inside the app and loads the built Angular files.

## Assumptions

- "Change by about 10%" is read as: small random steps of 1 to 3% per tick, with values limited to a 10% band around the base value. A literal ±10% each second would make the charts very jumpy.
- Status is based on how far the value is from its base value: Normal up to 4%, Warning above 4% up to 7%, Critical above 7%. It uses base units, so changing the unit never changes the status.
- Gauge ranges (base units): velocity 0 to 250 cm/s, pressure 800 to 1200 mbar, temperature 20 to 55 °C.
- Export uses the units selected at the time of export, with the unit in each column header, and covers up to about 1 hour of samples (3600 rows) collected since the app opened.
- The simulation restarts from the base values when the backend restarts.

## Known limitations

- When the chart is zoomed in, new points keep arriving, so the zoomed window slowly moves. Use the Reset button to go back to the full view.
- The installer is not code-signed, so Windows may show a SmartScreen warning.
- Port 3000 must be free.