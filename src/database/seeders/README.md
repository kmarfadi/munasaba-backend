# Database Seeders

This directory contains database seeders organized following the Single Responsibility Principle (SRP). Each seeder is responsible for populating a single entity table with realistic test data.

## Seeder Order and Dependencies

The seeders are numbered sequentially and must be run in order due to foreign key dependencies:

1. **01-organizations.seeder.ts**
   - Seeds the `organizations` table
   - No dependencies
   - Creates 4 sample organizations with different plans and settings

2. **02-users.seeder.ts**
   - Seeds the `users` table
   - Depends on: `organizations` table
   - Creates 7 users with different roles and organization assignments
   - Uses bcrypt for password hashing (default password: `password123`)

3. **03-events.seeder.ts**
   - Seeds the `events` table
   - Depends on: `users` and `organizations` tables
   - Creates 6 diverse events with different statuses and metadata
   - Includes past, present, and future events for comprehensive testing

4. **04-guests.seeder.ts**
   - Seeds the `guests` table
   - Depends on: `events` table
   - Creates 55+ guests across different events
   - Includes various check-in/out statuses and realistic metadata

## Usage

### Running Seeders

```typescript
import { DataSource } from 'typeorm';
import { runSeeds } from './src/database/seeders/run-seeds';

// Initialize your DataSource
const dataSource = new DataSource({...});

// Run all seeders
await runSeeds(dataSource);
```

### Clearing Seeders

```typescript
import { clearSeeds } from './src/database/seeders/run-seeds';

// Clear all seeded data
await clearSeeds(dataSource);
```

### Running Individual Seeders

```typescript
import { OrganizationsSeeder } from './src/database/seeders/01-organizations.seeder';

const seeder = new OrganizationsSeeder(dataSource);
await seeder.run(); // Seed data
await seeder.clear(); // Clear data
```

## Sample Data Overview

### Organizations (4 total)
- **TechCorp Inc.** - Pro plan, dark theme
- **Event Masters** - Enterprise plan, light theme
- **StartupHub** - Free plan, blue theme
- **Community Center** - Free plan, inactive

### Users (7 total)
- **TechCorp**: admin@techcorp.com (owner), manager@techcorp.com (admin), user@techcorp.com (member)
- **Event Masters**: admin@eventmasters.com (owner), coordinator@eventmasters.com (admin)
- **StartupHub**: organizer@startuphub.com (owner)
- **Community Center**: inactive@community.com (member, inactive)

### Events (6 total)
- **Tech Conference 2024** - Published, future event
- **Product Launch Event** - Draft, future event
- **Wedding Planning Workshop** - Published, future event
- **Startup Pitch Night** - Published, future event
- **Cancelled Event Example** - Cancelled, inactive
- **Completed Event Example** - Completed, past event

### Guests (55+ total)
- **Tech Conference**: 15 guests with various check-in statuses
- **Wedding Workshop**: 8 guests with professional backgrounds
- **Startup Pitch**: 12 founders/observers with pitch data
- **Completed Event**: 20 historical attendees (including 1 no-show)

## Key Features

### Safety Measures
- **Existence Checks**: All seeders check if data already exists before seeding
- **Dependency Validation**: Seeders verify required parent data exists
- **Error Handling**: Comprehensive error handling with descriptive messages
- **Transaction Safety**: Uses repository save methods for atomic operations

### Realistic Data
- **Proper Relationships**: All foreign keys properly linked
- **Realistic Timestamps**: Past, present, and future dates for comprehensive testing
- **Varied Statuses**: Different entity statuses for edge case testing
- **Rich Metadata**: JSONB fields with realistic nested data
- **Password Security**: Properly hashed passwords using bcrypt

### SOC (Separation of Concerns)
- **Single Responsibility**: Each seeder handles one entity
- **Clear Dependencies**: Explicit dependency chain
- **Modular Structure**: Easy to run individually or as a group
- **Isolated Changes**: Changes to one entity don't affect others

## Customization

To modify seeded data:

1. **Add New Organizations**: Edit `01-organizations.seeder.ts`
2. **Add New Users**: Edit `02-users.seeder.ts` (ensure organization IDs exist)
3. **Add New Events**: Edit `03-events.seeder.ts` (ensure user/org IDs exist)
4. **Add New Guests**: Edit `04-guests.seeder.ts` (ensure event IDs exist)

## Notes

- Default password for all users: `password123`
- All timestamps are relative to when seeders are run
- Metadata fields contain realistic JSON structures for testing
- Guest counts are realistic for event types
- Some events are intentionally inactive/cancelled for edge case testing
