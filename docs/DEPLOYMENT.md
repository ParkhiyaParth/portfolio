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

> **No domain yet?** [sslip.io](https://sslip.io) gives you a free hostname
> for any IP with no signup: `<ip-with-dashes>.sslip.io` (e.g.
> `203-0-113-5.sslip.io`, or `portfolio.203-0-113-5.sslip.io` for a
> subdomain) resolves straight to that IP, and Caddy can obtain a real
> Let's Encrypt certificate for it exactly like a normal domain. Use one of
> these in place of `yourdomain.com` anywhere below.

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
curl -I https://yourdomain.com                            # frontend
curl -X POST https://yourdomain.com/api/contact \          # backend, through Caddy
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","message":"Verifying the deploy end to end."}'
```

The backend's plain `GET /` health check isn't publicly reachable through
Caddy (only `/api/*` is proxied to it) — check it directly on the server
instead: `docker compose exec backend curl -s http://localhost:8000/`.

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

## Already running your own Caddy (or other sites) on this server?

If the server already has a system-level Caddy (or Nginx, etc.) bound to
ports 80/443 for other projects, don't run this stack's own `caddy`
service — it'll lose the fight for the port. Instead:

1. Skip the bundled Caddy and only bring up the app containers, publishing
   them on localhost-only ports via a `docker-compose.override.yml`
   (Compose merges this automatically, and it's gitignored so it stays
   host-specific):

   ```yaml
   # docker-compose.override.yml
   services:
     frontend:
       ports:
         - "127.0.0.1:3001:3000"
     backend:
       ports:
         - "127.0.0.1:8001:8000"
   ```

   ```bash
   docker compose up -d --build frontend backend
   ```

2. Append a new site block to the *existing* Caddyfile (don't touch the
   other sites already in there) pointing at those local ports:

   ```caddyfile
   portfolio.yourdomain-or-sslip-host {
       handle /api/* {
           reverse_proxy 127.0.0.1:8001
       }
       handle {
           reverse_proxy 127.0.0.1:3001
       }
   }
   ```

3. Validate and reload without downtime for the other sites:

   ```bash
   sudo caddy validate --config /etc/caddy/Caddyfile
   sudo systemctl reload caddy
   ```

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
