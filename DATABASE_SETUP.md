# 🗄️ Database Setup Guide

## 📋 Schema Overview

### Tables

| Table  | Description | Key Fields |
|--------|-------------|------------|
| `users` | User accounts and authentication | `id`, `email`, `password`, `firstName`, `lastName` |
| `events` | Event management | `id`, `title`, `startDate`, `location`, `organizerId` |
| `guests` | Guest registration and check-in | `id`, `firstName`, `lastName`, `email`, `eventId` |

### Relationships

```
users (1) ──→ (many) events (organizerId)
events (1) ──→ (many) guests (eventId)
```

### Indexes

- `users.email` (unique)
- `events.organizerId`
- `events.startDate`
- `guests.eventId`
- `guests.email`

## 🚀 Setup Instructions

### 1. Start Database
```bash
npm run dev:db
```

### 2. Run Migrations
```bash
npm run migration:run
```

### 3. Seed Initial Data
```bash
npm run seed
```

### 4. Start Application
```bash
npm run start:dev
```

## 🌱 Sample Data

### Users
- **Admin**: `admin@munasaba.com` / `admin123`
- **Demo**: `demo@munasaba.com` / `demo123`

### Events
- Tech Conference 2024 (500 guests)
- Wedding Reception (150 guests)
- Birthday Party (50 guests)

### Guests
- 6 sample guests with various check-in statuses

## 🔧 Migration Commands

```bash
# Generate new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

## 🌱 Seeding Commands

```bash
# Run all seeders
npm run seed

# Reset database and reseed
npm run db:reset
```

## 📁 File Structure

```
src/database/
├── migrations/
│   └── 1700000000000-InitialSchema.ts
└── seeders/
    └── run-seeds.ts
```

## 🔍 Database Configuration

The database configuration is located in:
- `src/config/database.config.ts` (for migrations)
- `src/app.module.ts` (for application)

Environment variables:
- `DB_HOST` (default: localhost)
- `DB_PORT` (default: 5432)
- `DB_USERNAME` (default: postgres)
- `DB_PASSWORD` (default: password)
- `DB_DATABASE` (default: munasaba)
