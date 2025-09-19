import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Event } from '@/modules/events/entities/event.entity';
import { Guest } from '@/modules/guests/entities/guest.entity';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async getDashboard(userId?: string) {
    const [totalEvents, totalGuests, checkedInGuests, recentEvents] = await Promise.all([
      this.getTotalEvents(userId),
      this.getTotalGuests(userId),
      this.getCheckedInGuests(userId),
      this.getRecentEvents(userId),
    ]);

    return {
      totalEvents,
      totalGuests,
      checkedInGuests,
      recentEvents,
      attendanceRate: totalGuests > 0 ? (checkedInGuests / totalGuests) * 100 : 0,
    };
  }

  async getEventStats(userId?: string) {
    const query = this.eventRepository.createQueryBuilder('event');
    
    if (userId) {
      query.where('event.organizerId = :userId', { userId });
    }

    const [totalEvents, upcomingEvents, pastEvents] = await Promise.all([
      query.getCount(),
      query.clone().where('event.startDate > :now', { now: new Date() }).getCount(),
      query.clone().where('event.startDate <= :now', { now: new Date() }).getCount(),
    ]);

    return {
      totalEvents,
      upcomingEvents,
      pastEvents,
    };
  }

  async getGuestStats(userId?: string) {
    const query = this.guestRepository.createQueryBuilder('guest')
      .leftJoin('guest.event', 'event');

    if (userId) {
      query.where('event.organizerId = :userId', { userId });
    }

    const [totalGuests, checkedInGuests, checkedOutGuests] = await Promise.all([
      query.getCount(),
      query.clone().where('guest.checkedIn = :checkedIn', { checkedIn: true }).getCount(),
      query.clone().where('guest.checkedOut = :checkedOut', { checkedOut: true }).getCount(),
    ]);

    return {
      totalGuests,
      checkedInGuests,
      checkedOutGuests,
      attendanceRate: totalGuests > 0 ? (checkedInGuests / totalGuests) * 100 : 0,
    };
  }

  async getEventAnalytics(eventId: string) {
    const event = await this.eventRepository.findOne({
      where: { id: eventId },
      relations: ['guests'],
    });

    if (!event) {
      throw new Error('Event not found');
    }

    const totalGuests = event.guests.length;
    const checkedInGuests = event.guests.filter(guest => guest.checkedIn).length;
    const checkedOutGuests = event.guests.filter(guest => guest.checkedOut).length;

    return {
      event: {
        id: event.id,
        title: event.title,
        startDate: event.startDate,
        location: event.location,
      },
      guests: {
        total: totalGuests,
        checkedIn: checkedInGuests,
        checkedOut: checkedOutGuests,
        attendanceRate: totalGuests > 0 ? (checkedInGuests / totalGuests) * 100 : 0,
      },
    };
  }

  async getAttendanceTrends(userId?: string, period: string = '30d') {
    const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const query = this.guestRepository.createQueryBuilder('guest')
      .leftJoin('guest.event', 'event')
      .where('guest.checkInTime >= :startDate', { startDate });

    if (userId) {
      query.andWhere('event.organizerId = :userId', { userId });
    }

    const guests = await query.getMany();

    // Group by date
    const trends = guests.reduce((acc, guest) => {
      const date = guest.checkInTime.toISOString().split('T')[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    return {
      period,
      trends,
      totalCheckIns: guests.length,
    };
  }

  private async getTotalEvents(userId?: string): Promise<number> {
    const query = this.eventRepository.createQueryBuilder('event');
    if (userId) {
      query.where('event.organizerId = :userId', { userId });
    }
    return query.getCount();
  }

  private async getTotalGuests(userId?: string): Promise<number> {
    const query = this.guestRepository.createQueryBuilder('guest')
      .leftJoin('guest.event', 'event');
    if (userId) {
      query.where('event.organizerId = :userId', { userId });
    }
    return query.getCount();
  }

  private async getCheckedInGuests(userId?: string): Promise<number> {
    const query = this.guestRepository.createQueryBuilder('guest')
      .leftJoin('guest.event', 'event')
      .where('guest.checkedIn = :checkedIn', { checkedIn: true });
    if (userId) {
      query.andWhere('event.organizerId = :userId', { userId });
    }
    return query.getCount();
  }

  private async getRecentEvents(userId?: string, limit: number = 5) {
    const query = this.eventRepository.createQueryBuilder('event')
      .orderBy('event.createdAt', 'DESC')
      .limit(limit);
    
    if (userId) {
      query.where('event.organizerId = :userId', { userId });
    }

    return query.getMany();
  }
}
