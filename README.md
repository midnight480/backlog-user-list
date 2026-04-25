# Backlog User List

> 🇯🇵 [日本語版 README はこちら](README_ja.md)

A web-based tool that extracts and visualizes user and project participation data from a [Backlog](https://backlog.com/) space. Built as a Cloudflare Worker with [Hono](https://hono.dev/).

## Features

- List all users in a Backlog space with role, last login, and Nulab account status
- List all projects with archive status, user count, and team count
- View per-project member and team details via modal
- Search / filter by email or project key
- Sortable columns, pagination, and CSV download
- Dark mode and Japanese / English UI toggle
- API rate-limit indicator

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Cloudflare Workers |
| Framework | Hono v4 |
| Language | TypeScript |
| Tooling | Wrangler v4 |

## Prerequisites

- Node.js (v18+)
- A Backlog space with an API key ([how to generate](https://support-ja.backlog.com/hc/ja/articles/360035641754))

## Getting Started

```bash
# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:8787` in your browser, enter your Space ID, domain, and API key, then click "Execute".

## Deployment

```bash
npm run deploy
```

This deploys the worker to Cloudflare using Wrangler. Make sure you are authenticated with `wrangler login` beforehand.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Serves the single-page UI |
| POST | `/api/analyze` | Fetches all users and projects for the space |
| POST | `/api/project/detail` | Returns members, teams, and admins for a single project |
| POST | `/api/team/members` | Returns members of a specific team in a project |

All POST endpoints accept JSON with `spaceId`, `domain`, and `apiKey` fields.

## License

This project does not currently specify a license.
