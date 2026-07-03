# Aquascape

Aquarium and vivarium planning platform. Plan, build, and track your aquariums and vivariums with a database of animals, plants, and products, complete with compatibility checking, environment tracking, and recommended maintenance routines.

## Features

- **Animal Database** — Browse fish, invertebrates, amphibians, and reptiles with accurate care requirements (temperature, pH, tank size, temperament, diet). Filter by category, difficulty, habitat, and biome.
- **Plant Database** — Aquatic and terrestrial plants with light requirements, growth rates, CO2 needs, and placement guidance.
- **Product Guide** — Curated equipment recommendations (filters, heaters, lighting, substrate) by budget tier.
- **Tank Builder** — Interactive setup designer with compatibility checking based on skill level and maintenance preferences. Generates tailored recommendations for animals, plants, **substrate, rocks & hardscape**, and equipment.
- **Saved Builds** — Persist builder projects, revisit parameters and recommendations, and delete builds from the list or detail page.
- **Compatibility Checker** — Pairwise animal compatibility based on temperament, size, and water needs.
- **Environment Tracking** — Create tracked environments and log water parameters, maintenance, feeding, and livestock health over time.
- **Maintenance Routines** — Each tracked environment gets recommended recurring routines (water changes, parameter tests, filter cleans, misting, UVB checks) tailored to its setup type. Add, edit, pause, complete, or delete routines.
- **Setup Checklist** — Interactive, environment-specific checklist for the full build process (plan → equipment → setup → cycle → stock → maintain). Progress is saved locally.
- **Beginner Guides** — Step-by-step articles covering the nitrogen cycle, water testing, fish diseases, plant care, compatible fish, first freshwater aquarium, environments, and upkeep.

## Tech Stack

- **Frontend**: Next.js 14 (App Router, TypeScript, Server Actions)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5
- **Validation**: Zod
- **Containerization**: Docker / Docker Compose

## Prerequisites

- **Docker** with the **Compose v2** plugin
- **Git** (to clone the repo)
- A server with at least **1 GB RAM** and ~1 GB free disk

> No Node.js, npm, or PostgreSQL install is required — everything runs in containers.

## Quick Start (local / dev)

```bash
git clone https://github.com/csmith665/aquascape.git
cd aquascape
docker compose up -d --build
```

The app is available at **http://localhost:3000** (plain HTTP — the dev default). The first build takes a few minutes; subsequent rebuilds are faster thanks to layer caching.

## Two Deployment Modes

The app supports two modes:

| | **Dev** (default) | **Prod** |
| --- | --- | --- |
| Command | `docker compose up -d --build` | start the shared proxy at `/home/cms/proxy`, then `docker compose up -d --build` |
| URL | `http://localhost:3000` | `https://YOUR-DOMAIN` |
| TLS | none (plain HTTP) | automatic Let's Encrypt via the shared Traefik proxy |
| Ports to open | 3000 | 80 and 443 (close 3000) |
| `DOMAIN` env | ignored | required (used in the Traefik `Host()` rule) |

**Dev** runs only the `app` and `db` services and publishes port 3000 directly. **Prod** uses a separate, shared [Traefik](https://traefik.io) proxy manager ([github.com/csmith665/proxy](https://github.com/csmith665/proxy)) that terminates TLS on 443 and routes by domain to any number of apps on the same server. Aquascape declares its domain via Docker labels and joins the shared `proxy` network — Traefik discovers it automatically and serves it over HTTPS. No proxy restart needed when adding the app.

## Deploy to Another Server (prod, HTTPS on 443)

The steps below assume a clean Linux server (Ubuntu/Debian) with SSH access. They deploy the **prod** mode with automatic TLS via the shared Traefik proxy.

### 1. Install Docker on the server

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker $USER
newgrp docker
```

Verify:

```bash
docker --version
docker compose version
```

### 2. Set up the shared proxy manager (once per server)

The proxy lives in its own repo and serves all your apps. Follow the setup steps in [github.com/csmith665/proxy](https://github.com/csmith665/proxy) — in summary:

```bash
docker network create proxy                       # one-time shared network
cd /home/cms
git clone https://github.com/csmith665/proxy.git proxy
cd proxy
cp .env.example .env                              # set ACME_EMAIL, DASHBOARD_DOMAIN, DASHBOARD_AUTH
docker compose up -d
```

Point A records for the proxy dashboard domain **and** every app domain at this server's public IP. Open ports 80 and 443 in your firewall. Once the proxy is up, any app that joins the `proxy` network and sets Traefik labels is served over HTTPS automatically.

### 3. Get the aquascape code

```bash
cd /home/cms
git clone https://github.com/csmith665/aquascape.git
cd aquascape
```

### 4. Configure `.env` (required — no defaults for secrets)

```bash
cp .env.example .env
```

Generate a strong database password and edit `.env`:

```bash
openssl rand -hex 18        # paste output into POSTGRES_PASSWORD and DATABASE_URL below
```

```dotenv
DOMAIN=aquascape.example.com
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<output of openssl rand -hex 18>
POSTGRES_DB=aquascape
DATABASE_URL=postgresql://postgres:<same password>@localhost:5432/aquascape
NODE_ENV=production
```

`.env` is gitignored — credentials never enter version control. `docker-compose.yml` reads these via variable substitution with **no default for `POSTGRES_PASSWORD`**, so the stack refuses to start without a real `.env`. The same password is used by the `db` service and the app's `DATABASE_URL`, so they always match.

> **Never commit a real password.** The committed `docker-compose.yml` and `.env.example` contain only placeholders.

### 5. Build and start

```bash
docker compose up -d --build
```

This starts PostgreSQL and the Next.js app and joins the `proxy` network. Traefik (already running from step 2) picks up the app's labels within seconds and begins serving `https://YOUR-DOMAIN` with an automatically obtained Let's Encrypt certificate. Postgres data lives in the `pgdata` volume; certs live in the proxy's `letsencrypt` volume.

> For **dev** on this same server (plain HTTP, no TLS), skip the proxy and just run `docker compose up -d --build` — the Traefik labels are inert when no proxy is on the `proxy` network.

### 6. Apply the schema and seed data

The production image does **not** run migrations automatically on startup (intentional — gives you control). Run once after the stack is up:

```bash
# Apply the Prisma schema to the database (creates/updates tables)
docker compose exec -T app npx prisma db push --skip-generate

# Seed sample data (animals, plants, products, compatibility rules)
docker compose exec -T app npm run db:seed
```

> If `prisma db push` reports the schema is already in sync, the build picked up the latest `schema.prisma`. To force a sync against an older image, run the command from a throwaway container that can reach the `db` service — pass the same password from `.env`:
>
> ```bash
> docker run --rm --network aquascape_default \
>   -e DATABASE_URL="postgresql://postgres:$(grep POSTGRES_PASSWORD .env | cut -d= -f2)@db:5432/aquascape" \
>   -v "$PWD":/app -w /app node:20-alpine \
>   sh -c "apk add --no-cache openssl && npm install && npx prisma db push --skip-generate"
> ```

### 7. Verify

```bash
docker compose ps                                 # app and db should be Up
curl -s -o /dev/null -w "HTTPS %{http_code}\n" https://aquascape.example.com
```

Open `https://YOUR-DOMAIN` in a browser. **Close port 3000** in your firewall so the app is only reachable through Traefik (TLS). The proxy redirects any plain-HTTP request on port 80 to HTTPS automatically.

### Rotating the database password

If you ever need to change the password on an existing deployment:

```bash
docker compose up -d db                                # start DB with current .env
docker compose exec -T db psql -U postgres -d aquascape \
  -c "ALTER USER postgres WITH PASSWORD '<new password>';"
# Update POSTGRES_PASSWORD and DATABASE_URL in .env to match, then:
docker compose up -d --build
```

The `pgdata` volume stores the password Postgres set, so the new `.env` must match whatever you set via `ALTER USER`.

### Updating an existing deployment

```bash
cd aquascape
git pull                       # if cloned from the repo
docker compose --profile prod up -d --build   # prod: rebuild with Caddy. Drop --profile prod for dev.
docker compose exec -T app npx prisma db push --skip-generate  # apply schema changes
```

> **Schema-change gotcha:** the production image bakes `schema.prisma` and the Prisma client in at build time. After any `prisma/schema.prisma` change, you must **rebuild the image** (`--build`) and then run `prisma db push` from inside the new container, or the runtime client won't know about new models/fields.

### Backing up the database

```bash
docker compose exec -T db pg_dump -U postgres aquascape > backup.sql
```

Restore:

```bash
docker compose exec -T db psql -U postgres -d aquascape < backup.sql
```

## Development

Local development without Docker (requires Node 20+):

```bash
npm install
npm run db:generate        # generate Prisma client
npm run db:push            # push schema to a local Postgres
npm run db:seed            # seed sample data
npm run dev                # start dev server on :3000
npm run lint               # ESLint (next/core-web-vitals)
npm run typecheck          # tsc --noEmit
```

To typecheck and build without installing Node locally, use a throwaway container:

```bash
docker run --rm -v "$PWD":/app -w /app node:20-alpine \
  sh -c "apk add --no-cache openssl && npm install && npx prisma generate && npx tsc --noEmit && npm run build"
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aquascape"
NODE_ENV="development"
```

| Variable       | Required | Default | Notes |
| -------------- | -------- | ------- | ----- |
| `DOMAIN`       | for TLS  | `localhost` | Domain Caddy serves on. Set to a real domain (with its A record pointing here) for automatic Let's Encrypt certs. Defaults to `localhost` with a self-signed internal CA cert. |
| `DATABASE_URL` | yes      | —       | Postgres connection string. In Compose, set by `app.environment` to point at the `db` service. |
| `NODE_ENV`     | no       | `development` | Set to `production` in the Compose stack. |

## Security

- **Automatic TLS** via Caddy — Let's Encrypt certificates are obtained and renewed automatically for the configured `DOMAIN`. Plain HTTP on port 80 redirects to HTTPS.
- Security headers set by both the Next.js middleware and Caddy (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy)
- Environment variable validation with Zod
- Prisma ORM prevents SQL injection
- React's JSX escaping prevents XSS
- Non-root Docker user (`nextjs`, uid 1001)
- WCAG AA contrast on buttons and badges

## Project Structure

```
aquascape/
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts          # Seed data
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── animals/     # Animal database
│   │   ├── plants/      # Plant database
│   │   ├── products/    # Product guide
│   │   ├── builder/     # Tank builder tool
│   │   ├── projects/    # Saved builds (list + detail + delete)
│   │   ├── compatibility/ # Pairwise compatibility checker
│   │   ├── tracking/    # Environment tracking + maintenance routines + logs
│   │   ├── setup-checklist/ # Interactive setup checklist
│   │   ├── guides/      # Beginner guides index
│   │   ├── articles/    # Individual guide articles
│   │   ├── layout.tsx   # Root layout + nav
│   │   └── globals.css  # Global styles
│   ├── components/      # React components
│   ├── lib/             # db client, env validation, compatibility, hardscape, routines
│   └── middleware.ts    # Security headers
├── Dockerfile
├── docker-compose.yml   # app + db + caddy (auto TLS on 443)
├── Caddyfile            # reverse proxy + automatic Let's Encrypt certs
└── package.json
```

## License

MIT
