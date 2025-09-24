import { DataSource } from 'typeorm';
import { OrganizationsSeeder } from './01-organizations.seeder';
import { UsersSeeder } from './02-users.seeder';
import { EventsSeeder } from './03-events.seeder';
import { GuestsSeeder } from './04-guests.seeder';
import { config } from 'dotenv';

// Load environment variables
config();

export async function runSeeds(dataSource: DataSource): Promise<void> {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Initialize seeders
    const organizationsSeeder = new OrganizationsSeeder(dataSource);
    const usersSeeder = new UsersSeeder(dataSource);
    const eventsSeeder = new EventsSeeder(dataSource);
    const guestsSeeder = new GuestsSeeder(dataSource);

    // Run seeders in dependency order
    console.log('📋 Step 1/4: Seeding Organizations...');
    await organizationsSeeder.run();
    
    console.log('👥 Step 2/4: Seeding Users...');
    await usersSeeder.run();
    
    console.log('🎉 Step 3/4: Seeding Events...');
    await eventsSeeder.run();
    
    console.log('🎫 Step 4/4: Seeding Guests...');
    await guestsSeeder.run();

    console.log('\n✅ Database seeding completed successfully!');
  } catch (error) {
    console.error('\n❌ Database seeding failed:', error);
    throw error;
  }
}

export async function clearSeeds(dataSource: DataSource): Promise<void> {
  console.log('🗑️ Clearing all seeded data...\n');

  try {
    // Initialize seeders
    const guestsSeeder = new GuestsSeeder(dataSource);
    const eventsSeeder = new EventsSeeder(dataSource);
    const usersSeeder = new UsersSeeder(dataSource);
    const organizationsSeeder = new OrganizationsSeeder(dataSource);

    // Clear seeders in reverse dependency order
    console.log('🎫 Step 1/4: Clearing Guests...');
    await guestsSeeder.clear();
    
    console.log('🎉 Step 2/4: Clearing Events...');
    await eventsSeeder.clear();
    
    console.log('👥 Step 3/4: Clearing Users...');
    await usersSeeder.clear();
    
    console.log('📋 Step 4/4: Clearing Organizations...');
    await organizationsSeeder.clear();

    console.log('\n✅ Database clearing completed successfully!');
  } catch (error) {
    console.error('\n❌ Database clearing failed:', error);
    throw error;
  }
}

// Main execution block for running as standalone script
async function main() {
  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
      'src/modules/**/entities/*.entity{.ts,.js}',
      'src/modules/**/*.entity{.ts,.js}',
    ],
    synchronize: false,
    logging: process.env.NODE_ENV === 'development',
  });

  try {
    console.log('🔌 Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connected successfully!\n');

    // Check command line arguments
    const args = process.argv.slice(2);
    if (args.includes('--clear')) {
      await clearSeeds(dataSource);
    } else {
      await runSeeds(dataSource);
    }
  } catch (error) {
    console.error('❌ Database operation failed:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed.');
    }
  }
}

// Run main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Unhandled error:', error);
    process.exit(1);
  });
}
