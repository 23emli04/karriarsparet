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

Create a `.env` or `.env.local` file to override. For production, set `VITE_API_BASE` to your API URL (e.g. `/api` if served behind a reverse proxy).

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Run ESLint

## API

See [docs/API_REFERENCE.md](docs/API_REFERENCE.md) for endpoint documentation.
