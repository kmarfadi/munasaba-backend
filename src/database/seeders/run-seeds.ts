import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { User } from '../../modules/user/auth/entities/user.entity';
import { Event } from '../../modules/events/event.entity';
import { Guest } from '../../modules/guests/guest.entity';
import * as bcrypt from 'bcryptjs';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'munasaba',
  entities: [
    join(__dirname, '../../modules/user/auth/entities/*.entity{.ts,.js}'),
    join(__dirname, '../../modules/events/*.entity{.ts,.js}'),
    join(__dirname, '../../modules/guests/*.entity{.ts,.js}'),
  ],
  synchronize: false,
  logging: true,
});

async function runSeeds() {
  try {
    await AppDataSource.initialize();
    console.log('🌱 Starting database seeding...');

    const userRepository = AppDataSource.getRepository(User);
    const eventRepository = AppDataSource.getRepository(Event);
    const guestRepository = AppDataSource.getRepository(Guest);

    // Create admin user
    const adminUser = userRepository.create({
      email: 'admin@munasaba.com',
      password: await bcrypt.hash('admin123', 12),
      firstName: 'Admin',
      lastName: 'User',
      isActive: true,
    });

    const savedAdmin = await userRepository.save(adminUser);
    console.log('✅ Admin user created:', savedAdmin.email);

    // Create demo user
    const demoUser = userRepository.create({
      email: 'demo@munasaba.com',
      password: await bcrypt.hash('demo123', 12),
      firstName: 'Demo',
      lastName: 'User',
      isActive: true,
    });

    const savedDemo = await userRepository.save(demoUser);
    console.log('✅ Demo user created:', savedDemo.email);

    // Create sample events
    const sampleEvents = [
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring the latest innovations',
        startDate: new Date('2024-12-15T09:00:00Z'),
        endDate: new Date('2024-12-15T17:00:00Z'),
        location: 'Convention Center, Downtown',
        category: 'Technology',
        maxGuests: 500,
        organizerId: savedAdmin.id,
      },
      {
        title: 'Wedding Reception',
        description: 'Celebration of love and commitment',
        startDate: new Date('2024-12-20T18:00:00Z'),
        endDate: new Date('2024-12-20T23:00:00Z'),
        location: 'Grand Hotel Ballroom',
        category: 'Wedding',
        maxGuests: 150,
        organizerId: savedDemo.id,
      },
      {
        title: 'Birthday Party',
        description: 'Surprise birthday celebration',
        startDate: new Date('2024-12-25T19:00:00Z'),
        endDate: new Date('2024-12-25T22:00:00Z'),
        location: 'Private Residence',
        category: 'Birthday',
        maxGuests: 50,
        organizerId: savedDemo.id,
      },
    ];

    const savedEvents: Event[] = [];
    for (const eventData of sampleEvents) {
      const event = eventRepository.create(eventData);
      const savedEvent = await eventRepository.save(event);
      savedEvents.push(savedEvent);
      console.log('✅ Event created:', savedEvent.title);
    }

    // Create sample guests
    const sampleGuests = [
      // Tech Conference guests
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1234567890',
        eventId: savedEvents[0].id,
        notes: 'VIP attendee',
        checkedIn: true,
        checkInTime: new Date('2024-12-15T08:45:00Z'),
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@email.com',
        phone: '+1234567891',
        eventId: savedEvents[0].id,
        notes: 'Speaker',
        checkedIn: true,
        checkInTime: new Date('2024-12-15T08:30:00Z'),
      },
      {
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob.johnson@email.com',
        phone: '+1234567892',
        eventId: savedEvents[0].id,
        notes: 'Media representative',
        checkedIn: false,
      },
      // Wedding guests
      {
        firstName: 'Alice',
        lastName: 'Brown',
        email: 'alice.brown@email.com',
        phone: '+1234567893',
        eventId: savedEvents[1].id,
        notes: 'Bridesmaid',
        checkedIn: true,
        checkInTime: new Date('2024-12-20T17:30:00Z'),
      },
      {
        firstName: 'Charlie',
        lastName: 'Wilson',
        email: 'charlie.wilson@email.com',
        phone: '+1234567894',
        eventId: savedEvents[1].id,
        notes: 'Groomsman',
        checkedIn: true,
        checkInTime: new Date('2024-12-20T17:45:00Z'),
      },
      // Birthday party guests
      {
        firstName: 'Diana',
        lastName: 'Davis',
        email: 'diana.davis@email.com',
        phone: '+1234567895',
        eventId: savedEvents[2].id,
        notes: 'Close friend',
        checkedIn: false,
      },
    ];

    for (const guestData of sampleGuests) {
      const guest = guestRepository.create(guestData);
      await guestRepository.save(guest);
      console.log('✅ Guest created:', `${guest.firstName} ${guest.lastName}`);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Users: 2 (admin@munasaba.com, demo@munasaba.com)`);
    console.log(`- Events: ${savedEvents.length}`);
    console.log(`- Guests: ${sampleGuests.length}`);
    console.log('\n🔑 Login credentials:');
    console.log('Admin: admin@munasaba.com / admin123');
    console.log('Demo: demo@munasaba.com / demo123');

  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

runSeeds();
