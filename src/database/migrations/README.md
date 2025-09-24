# Database Migrations

This directory contains database migrations organized following the Single Responsibility Principle (SRP). Each migration is responsible for creating and managing a single entity table with its associated indexes and foreign keys.

## Migration Order and Dependencies

The migrations are numbered sequentially and must be run in order due to foreign key dependencies:

1. **1700000000001-CreateOrganizationsTable.ts**
   - Creates the `organizations` table
   - No dependencies
   - Includes indexes on `slug`, `isActive`, and `plan`

2. **1700000000002-CreateUsersTable.ts**
   - Creates the `users` table
   - Depends on: `organizations` table
   - Includes foreign key to `organizations.id`
   - Includes indexes on `email`, `organizationId`, `role`, and `isActive`

3. **1700000000003-CreateEventsTable.ts**
   - Creates the `events` table
   - Depends on: `users` and `organizations` tables
   - Includes foreign keys to `users.id` and `organizations.id`
   - Includes comprehensive indexing for performance
   - Includes partial indexes for active and published events

4. **1700000000004-CreateGuestsTable.ts**
   - Creates the `guests` table
   - Depends on: `events` table
   - Includes foreign key to `events.id`
   - Includes comprehensive indexing for check-in/out operations
   - Includes partial indexes for checked-in and active guests

## Key Features

### Safety Measures
- **Existence Checks**: All migrations check if tables/indexes already exist before creating them
- **Conditional Creation**: Uses `IF NOT EXISTS` clauses where possible
- **Safe Rollbacks**: Down migrations check for existence before attempting to drop objects
- **Foreign Key Validation**: Foreign keys are only created if referenced tables exist

### Performance Optimizations
- **Strategic Indexing**: Each table includes indexes optimized for common query patterns
- **Composite Indexes**: Multi-column indexes for complex queries
- **Partial Indexes**: Conditional indexes for filtered data sets
- **JSONB Support**: Proper indexing for JSONB metadata fields

### SOC (Separation of Concerns)
- **Single Responsibility**: Each migration handles one entity
- **Clear Dependencies**: Explicit dependency chain
- **Modular Structure**: Easy to understand and maintain
- **Isolated Changes**: Changes to one entity don't affect others

## Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Generate a new migration (if needed)
npm run migration:generate -- src/database/migrations/NewMigrationName

# Revert the last migration
npm run migration:revert
```

## Migration Best Practices

1. **Always check for existence** before creating objects
2. **Use proper foreign key constraints** with appropriate cascade rules
3. **Include comprehensive indexes** for performance
4. **Test rollback procedures** to ensure clean reversibility
5. **Use descriptive names** that clearly indicate the migration purpose
6. **Follow dependency order** strictly to avoid foreign key errors

## Entity Relationships

```
Organizations (1) ──── (N) Users
    │
    └─── (N) Events
            │
            └─── (N) Guests
```

This structure ensures data integrity while maintaining flexibility for future enhancements.
