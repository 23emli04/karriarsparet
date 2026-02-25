# Karriärspåret

Swedish education portal – search and browse university and college programs.

## Tech stack

- React 19, TypeScript, Vite 7
- Tailwind CSS 4
- React Router 7

## Prerequisites

- Node.js 18+
- Running backend API (default: `http://localhost:8080`)

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Environment variables

| Variable        | Default                        | Description                |
|----------------|--------------------------------|----------------------------|
| `VITE_API_BASE` | `http://localhost:8080/api`   | Backend API base URL       |

- **Local:** Create `.env.local` with `VITE_API_BASE=http://localhost:8080/api` (or copy from `.env.example`).
- **Production (GitHub Pages):** In repo **Settings → Secrets and variables → Actions → Variables**, add `VITE_API_BASE` with your production API URL (e.g. `https://your-backend.example.com/api`).

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

## API

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for endpoint documentation.
