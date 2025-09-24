import { DataSource } from 'typeorm';
import { Event } from '../../modules/events/event.entity';
import { User } from '../../modules/user/auth/entities/user.entity';
import { Organization } from '../../modules/organizations/entities/organization.entity';

export class EventsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const eventRepository = this.dataSource.getRepository(Event);
    const userRepository = this.dataSource.getRepository(User);
    const organizationRepository = this.dataSource.getRepository(Organization);

    // Check if events already exist
    const existingCount = await eventRepository.count();
    if (existingCount > 0) {
      console.log(`✅ Events already seeded (${existingCount} found)`);
      return;
    }

    // Get users and organizations for event assignment
    const users = await userRepository.find({ where: { isActive: true } });
    const organizations = await organizationRepository.find({ where: { isActive: true } });

    if (users.length === 0) {
      console.log('⚠️ No active users found. Run users seeder first.');
      return;
    }

    const techCorpOrg = organizations.find(org => org.slug === 'techcorp-inc');
    const eventMastersOrg = organizations.find(org => org.slug === 'event-masters');
    const startupHubOrg = organizations.find(org => org.slug === 'startup-hub');

    const techCorpUser = users.find(user => user.email === 'admin@techcorp.com');
    const eventMasterUser = users.find(user => user.email === 'admin@eventmasters.com');
    const startupUser = users.find(user => user.email === 'organizer@startuphub.com');

    const now = new Date();
    const futureDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const pastDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // 1 week ago

    const events = [
      {
        title: 'Tech Conference 2024',
        description: 'Annual technology conference featuring latest innovations and networking opportunities',
        startDate: futureDate,
        endDate: new Date(futureDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        location: 'Convention Center, Downtown',
        category: 'Technology',
        maxGuests: 500,
        organizerId: techCorpUser?.id,
        organizationId: techCorpOrg?.id,
        isActive: true,
        guestCount: 0,
        metadata: {
          venue: 'Convention Center',
          capacity: 500,
          sponsors: ['TechCorp', 'InnovateHub'],
          tags: ['technology', 'conference', 'networking']
        },
        status: 'published' as const,
        publishedAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
      },
      {
        title: 'Product Launch Event',
        description: 'Launch of our revolutionary new product line',
        startDate: new Date(futureDate.getTime() + 14 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 14 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        location: 'TechCorp Headquarters',
        category: 'Product',
        maxGuests: 200,
        organizerId: techCorpUser?.id,
        organizationId: techCorpOrg?.id,
        isActive: true,
        guestCount: 0,
        metadata: {
          venue: 'Headquarters Auditorium',
          capacity: 200,
          product: 'Revolutionary AI Platform',
          tags: ['product', 'launch', 'ai']
        },
        status: 'draft' as const,
        publishedAt: undefined,
      },
      {
        title: 'Wedding Planning Workshop',
        description: 'Learn professional wedding planning techniques and trends',
        startDate: new Date(futureDate.getTime() + 21 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 21 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
        location: 'Event Masters Studio',
        category: 'Education',
        maxGuests: 50,
        organizerId: eventMasterUser?.id,
        organizationId: eventMastersOrg?.id,
        isActive: true,
        guestCount: 0,
        metadata: {
          venue: 'Professional Studio',
          capacity: 50,
          instructor: 'Alice EventMaster',
          tags: ['wedding', 'planning', 'workshop']
        },
        status: 'published' as const,
        publishedAt: new Date(now.getTime() - 48 * 60 * 60 * 1000),
      },
      {
        title: 'Startup Pitch Night',
        description: 'Monthly startup pitch competition with investor panel',
        startDate: new Date(futureDate.getTime() + 28 * 24 * 60 * 60 * 1000),
        endDate: new Date(futureDate.getTime() + 28 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        location: 'StartupHub Innovation Center',
        category: 'Business',
        maxGuests: 100,
        organizerId: startupUser?.id,
        organizationId: startupHubOrg?.id,
        isActive: true,
        guestCount: 0,
        metadata: {
          venue: 'Innovation Center',
          capacity: 100,
          judges: ['Investor A', 'Investor B', 'Mentor C'],
          tags: ['startup', 'pitch', 'investment']
        },
        status: 'published' as const,
        publishedAt: new Date(now.getTime() - 72 * 60 * 60 * 1000),
      },
      {
        title: 'Cancelled Event Example',
        description: 'This event was cancelled due to unforeseen circumstances',
        startDate: new Date(futureDate.getTime() + 35 * 24 * 60 * 60 * 1000),
        endDate: undefined,
        location: 'TBD',
        category: 'Other',
        maxGuests: 50,
        organizerId: techCorpUser?.id,
        organizationId: techCorpOrg?.id,
        isActive: false,
        guestCount: 0,
        metadata: {
          cancellationReason: 'Venue unavailable',
          refundProcessed: true
        },
        status: 'cancelled' as const,
        publishedAt: new Date(now.getTime() - 96 * 60 * 60 * 1000),
      },
      {
        title: 'Completed Event Example',
        description: 'This event has already been completed successfully',
        startDate: pastDate,
        endDate: new Date(pastDate.getTime() + 4 * 60 * 60 * 1000),
        location: 'Community Center',
        category: 'Community',
        maxGuests: 75,
        organizerId: eventMasterUser?.id,
        organizationId: eventMastersOrg?.id,
        isActive: true,
        guestCount: 72,
        metadata: {
          actualAttendance: 72,
          feedback: 'Excellent event, highly recommended',
          tags: ['community', 'completed']
        },
        status: 'completed' as const,
        publishedAt: new Date(pastDate.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    ].filter(event => event.organizerId && event.organizationId); // Filter out events without valid organizers/orgs

    try {
      const createdEvents = await eventRepository.save(events);
      console.log(`✅ Seeded ${createdEvents.length} events`);
    } catch (error) {
      console.error('❌ Error seeding events:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    const eventRepository = this.dataSource.getRepository(Event);
    
    try {
      await eventRepository.query('DELETE FROM events');
      console.log('🗑️ Cleared all events');
    } catch (error) {
      console.error('❌ Error clearing events:', error);
      throw error;
    }
  }
}
