# Aquascape

Aquarium and vivarium planning platform. Plan, build, and track your aquariums and vivariums with a database of animals, plants, and products, complete with compatibility checking and environment tracking.

## Features

- **Animal Database** — Browse fish, invertebrates, amphibians, and reptiles with accurate care requirements (temperature, pH, tank size, temperament, diet)
- **Plant Database** — Aquatic and terrestrial plants with light requirements, growth rates, and placement guidance
- **Product Guide** — Curated equipment recommendations (filters, heaters, lighting, substrate) by budget tier
- **Tank Builder** — Interactive setup designer with compatibility checking based on skill level and maintenance preferences
- **Environment Tracking** — Log water parameters, maintenance activities, feeding schedules, and livestock health over time
- **Beginner Guides** — Step-by-step guides for setting up and maintaining aquariums and vivariums

## Tech Stack

- **Frontend**: Next.js 14 (App Router, TypeScript)
- **Database**: PostgreSQL 16
- **ORM**: Prisma 5
- **Validation**: Zod
- **Containerization**: Docker

## Quick Start

```bash
# Start the app and database
docker compose up -d

# The app will be available at http://localhost:3000
```

## Development

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with sample data
npm run db:seed

# Start dev server
npm run dev
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/aquascape"
NODE_ENV="development"
```

## Security

- Security headers middleware (X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy)
- Environment variable validation with Zod
- Prisma ORM prevents SQL injection
- React's JSX escaping prevents XSS
- Non-root Docker user

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
│   │   ├── tracking/    # Environment tracking
│   │   └── guides/      # Beginner guides
│   ├── components/      # React components
│   ├── lib/             # Database client, env validation
│   └── middleware.ts    # Security headers
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## License

MIT
