# Self-Hosted Deployment (Docker)

This deploys the whole stack — the Next.js frontend, the FastAPI backend, and a
[Caddy](https://caddyserver.com/) reverse proxy that handles HTTPS automatically —
to your own server with a single `docker compose` command.

## Architecture

```
                        ┌────────────────────┐
  Internet ── :80/:443 →│   Caddy (proxy)    │
                        └──────────┬─────────┘
                    /api/*         │        everything else
                    ┌──────────────┴──────────────┐
                    ▼                              ▼
          ┌───────────────────┐          ┌───────────────────┐
          │ backend (FastAPI) │          │ frontend (Next.js) │
          │      :8000        │          │       :3000        │
          └───────────────────┘          └───────────────────┘
```

Frontend and backend share one domain (Caddy routes `/api/*` to the backend
and everything else to the frontend), so there's no CORS to configure for
normal use — the browser only ever talks to your domain.

## Prerequisites

- A server (VPS or otherwise) with a public IP
- [Docker](https://docs.docker.com/engine/install/) and the Docker Compose plugin installed
- A domain name with an **A record pointing at your server's IP** (required for Caddy to obtain a Let's Encrypt certificate automatically)
- Ports `80` and `443` open/forwarded to the server

## 1. Clone the repo on the server

```bash
git clone https://github.com/ParkhiyaParth/portfolio.git
cd portfolio
```

## 2. Configure environment variables

```bash
cp .env.example .env
cp backend/.env.example backend/.env
```

Edit `.env`:

```env
NEXT_PUBLIC_API_URL=https://yourdomain.com
ALLOWED_ORIGINS=https://yourdomain.com
```

Edit `backend/.env` with your real SMTP credentials (see
[backend/README.md](../backend/README.md) for Gmail app-password setup).

## 3. Point Caddy at your domain

Edit `Caddyfile` and replace `yourdomain.com` with your actual domain.

> Testing without a domain yet? Replace the domain line with `:80` — Caddy
> will serve plain HTTP on port 80 instead of provisioning TLS.

## 4. Build and run

```bash
docker compose up -d --build
```

This builds and starts three containers: `frontend`, `backend`, and `caddy`.
First-time TLS issuance can take a few seconds — check `docker compose logs -f caddy`
if the site doesn't load immediately over HTTPS.

## 5. Verify

```bash
curl -I https://yourdomain.com          # frontend
curl https://yourdomain.com/api/        # backend health check → {"status":"ok",...}
```

## Updating after a code change

```bash
git pull
docker compose up -d --build
```

## Useful commands

| Command                                  | Purpose                          |
| ----------------------------------------- | --------------------------------- |
| `docker compose logs -f`                 | Tail logs from all services       |
| `docker compose logs -f backend`         | Tail just the backend             |
| `docker compose ps`                      | Container status                  |
| `docker compose down`                    | Stop everything                   |
| `docker compose up -d --build frontend`  | Rebuild/restart just the frontend |

## Already running your own Nginx?

You don't need Caddy — remove the `caddy` service from `docker-compose.yml`,
publish ports directly on `frontend` (`3000:3000`) and `backend` (`8000:8000`),
and point your existing Nginx `server` block at them instead, e.g.:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;

    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host $host;
    }

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
    }
}
```
