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

## Quick Start (local)

```bash
git clone https://github.com/csmith665/aquascape.git
cd aquascape
docker compose up -d --build
```

The app is available at **http://localhost:3000**. The first build takes a few minutes; subsequent rebuilds are faster thanks to layer caching.

## Deploy to Another Server

The recommended deployment is the same Docker Compose stack used locally. The steps below assume a clean Linux server (Ubuntu/Debian) with SSH access.

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

### 2. Get the code on the server

Option A — clone (recommended):

```bash
git clone https://github.com/csmith665/aquascape.git
cd aquascape
```

Option B — copy from your local machine:

```bash
scp -r ./aquascape user@your-server:/home/user/aquascape
```

### 3. Configure environment (optional)

The defaults in `docker-compose.yml` work out of the box for a single-host deploy. To change the database password or other settings, create a `.env` file:

```bash
cp .env.example .env
# Edit .env — only DATABASE_URL and NODE_ENV are read by the app container.
# Keep DATABASE_URL in sync with docker-compose.yml's db service credentials.
```

To change the **database password**, edit both:
- `docker-compose.yml` → `db.environment.POSTGRES_PASSWORD` and `app.environment.DATABASE_URL`
- `.env` → `DATABASE_URL` (used by local dev / one-off commands)

### 4. Build and start

```bash
docker compose up -d --build
```

This builds the app image, starts PostgreSQL, and starts the Next.js app. The database is a named volume (`pgdata`) so data persists across restarts.

### 5. Apply the schema and seed data

The production image does **not** run migrations automatically on startup (this is intentional — it gives you control). Run them once after the stack is up:

```bash
# Apply the Prisma schema to the database (creates/updates tables)
docker compose exec -T app npx prisma db push --skip-generate

# Seed sample data (animals, plants, products, compatibility rules)
docker compose exec -T app npm run db:seed
```

> If `prisma db push` reports the schema is already in sync, the build picked up the latest `schema.prisma`. To force a sync against an older image, run the command from a throwaway container that can reach the `db` service:
>
> ```bash
> docker run --rm --network aquascape_default \
>   -e DATABASE_URL="postgresql://postgres:postgres@db:5432/aquascape" \
>   -v "$PWD":/app -w /app node:20-alpine \
>   sh -c "apk add --no-cache openssl && npm install && npx prisma db push --skip-generate"
> ```

### 6. Verify

```bash
docker compose ps              # both services should be Up / healthy
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000
```

Open `http://YOUR-SERVER-IP:3000` in a browser. Port 3000 must be open in any firewall/security group.

### 7. Put it behind a reverse proxy (recommended for public access)

For HTTPS and a real domain, put the app behind Caddy, Traefik, or Nginx. A minimal Caddy example (`Caddyfile`):

```caddy
aquascape.example.com {
    reverse_proxy localhost:3000
}
```

Run Caddy in a container or as a system service. It will provision Let's Encrypt certs automatically.

### Updating an existing deployment

```bash
cd aquascape
git pull                       # if cloned from the repo
docker compose up -d --build   # rebuild with the new code
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
```

There is no `npm run lint` script configured yet (see issue #2). To typecheck and build locally without installing Node, use a throwaway container:

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
| `DATABASE_URL` | yes      | —       | Postgres connection string. In Compose, set by `app.environment` to point at the `db` service. |
| `NODE_ENV`     | no       | `development` | Set to `production` in the Compose stack. |

## Security

- Security headers middleware (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy)
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
├── docker-compose.yml
└── package.json
```

## License

MIT
