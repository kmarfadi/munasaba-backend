import { DataSource } from 'typeorm';
import { Guest } from '../../modules/guests/guest.entity';
import { Event } from '../../modules/events/event.entity';

export class GuestsSeeder {
  constructor(private dataSource: DataSource) {}

  async run(): Promise<void> {
    const guestRepository = this.dataSource.getRepository(Guest);
    const eventRepository = this.dataSource.getRepository(Event);

    // Check if guests already exist
    const existingCount = await guestRepository.count();
    if (existingCount > 0) {
      console.log(`✅ Guests already seeded (${existingCount} found)`);
      return;
    }

    // Get events for guest assignment
    const events = await eventRepository.find({ 
      where: { isActive: true },
      relations: ['organizer']
    });

    if (events.length === 0) {
      console.log('⚠️ No active events found. Run events seeder first.');
      return;
    }

    const techConference = events.find(event => event.title === 'Tech Conference 2024');
    const weddingWorkshop = events.find(event => event.title === 'Wedding Planning Workshop');
    const startupPitch = events.find(event => event.title === 'Startup Pitch Night');
    const completedEvent = events.find(event => event.title === 'Completed Event Example');

    const now = new Date();
    const pastCheckIn = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2 hours ago
    const pastCheckOut = new Date(now.getTime() - 30 * 60 * 1000); // 30 minutes ago

    const guests = [
      // Tech Conference Guests
      ...Array.from({ length: 15 }, (_, i) => ({
        firstName: `Tech`,
        lastName: `Attendee${i + 1}`,
        email: `attendee${i + 1}@techconference.com`,
        phone: `+1-555-${String(i + 1).padStart(4, '0')}`,
        eventId: techConference?.id,
        notes: i < 5 ? 'VIP attendee' : undefined,
        checkedIn: i < 8,
        checkedOut: i < 3,
        checkInTime: i < 8 ? new Date(pastCheckIn.getTime() + i * 5 * 60 * 1000) : undefined,
        checkOutTime: i < 3 ? new Date(pastCheckOut.getTime() + i * 10 * 60 * 1000) : undefined,
        metadata: {
          registrationSource: 'website',
          company: i % 3 === 0 ? 'TechCorp' : i % 3 === 1 ? 'InnovateHub' : undefined,
          dietaryRequirements: i === 2 ? 'Vegetarian' : undefined
        },
        status: i < 3 ? 'checked-out' as const : i < 8 ? 'checked-in' as const : 'registered' as const,
      })),

      // Wedding Workshop Guests
      ...Array.from({ length: 8 }, (_, i) => ({
        firstName: `Wedding`,
        lastName: `Planner${i + 1}`,
        email: `planner${i + 1}@weddingworkshop.com`,
        phone: `+1-555-${String(i + 100).padStart(4, '0')}`,
        eventId: weddingWorkshop?.id,
        notes: i === 0 ? 'Professional wedding planner' : undefined,
        checkedIn: i < 5,
        checkedOut: false,
        checkInTime: i < 5 ? new Date(pastCheckIn.getTime() + i * 10 * 60 * 1000) : undefined,
        checkOutTime: undefined,
        metadata: {
          registrationSource: 'email-invite',
          experience: i % 2 === 0 ? 'beginner' : 'intermediate',
          specialRequests: i === 3 ? 'Materials needed' : undefined
        },
        status: i < 5 ? 'checked-in' as const : 'registered' as const,
      })),

      // Startup Pitch Guests
      ...Array.from({ length: 12 }, (_, i) => ({
        firstName: `Startup`,
        lastName: `Founder${i + 1}`,
        email: `founder${i + 1}@startuppitch.com`,
        phone: `+1-555-${String(i + 200).padStart(4, '0')}`,
        eventId: startupPitch?.id,
        notes: i < 3 ? 'Pitching today' : 'Observer',
        checkedIn: i < 9,
        checkedOut: i < 2,
        checkInTime: i < 9 ? new Date(pastCheckIn.getTime() + i * 3 * 60 * 1000) : undefined,
        checkOutTime: i < 2 ? new Date(pastCheckOut.getTime() + i * 15 * 60 * 1000) : undefined,
        metadata: {
          registrationSource: 'startup-hub',
          startupName: i < 3 ? `Startup${i + 1} Inc.` : undefined,
          pitchOrder: i < 3 ? i + 1 : undefined
        },
        status: i < 2 ? 'checked-out' as const : i < 9 ? 'checked-in' as const : 'registered' as const,
      })),

      // Completed Event Guests (for historical data)
      ...Array.from({ length: 20 }, (_, i) => ({
        firstName: `Past`,
        lastName: `Attendee${i + 1}`,
        email: `past${i + 1}@completedevent.com`,
        phone: `+1-555-${String(i + 300).padStart(4, '0')}`,
        eventId: completedEvent?.id,
        notes: i === 5 ? 'No-show' : undefined,
        checkedIn: i !== 5,
        checkedOut: i !== 5,
        checkInTime: i !== 5 ? new Date(pastCheckIn.getTime() + i * 2 * 60 * 1000) : undefined,
        checkOutTime: i !== 5 ? new Date(pastCheckOut.getTime() + i * 5 * 60 * 1000) : undefined,
        metadata: {
          registrationSource: 'community-center',
          feedback: i % 4 === 0 ? 'Excellent event!' : undefined
        },
        status: i === 5 ? 'no-show' as const : 'checked-out' as const,
      })),
    ].filter(guest => guest.eventId); // Filter out guests without valid events

    try {
      const createdGuests = await guestRepository.save(guests);
      console.log(`✅ Seeded ${createdGuests.length} guests`);
    } catch (error) {
      console.error('❌ Error seeding guests:', error);
      throw error;
    }
  }

  async clear(): Promise<void> {
    const guestRepository = this.dataSource.getRepository(Guest);
    
    try {
      await guestRepository.query('DELETE FROM guests');
      console.log('🗑️ Cleared all guests');
    } catch (error) {
      console.error('❌ Error clearing guests:', error);
      throw error;
    }
  }
}
