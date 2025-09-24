import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RedisService } from '../../common/cache/redis.service';
import { Event } from './event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    private redisService: RedisService,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId: userId,
      status: 'draft',
    });

    const savedEvent = await this.eventRepository.save(event);
    
    // Invalidate cache for user's events
    await this.redisService.delPattern(`user:${userId}:events:*`);
    
    return savedEvent;
  }

  // Optimized pagination with cursor-based approach
  async findAll(page: number = 1, limit: number = 10, organizerId?: string) {
    const cacheKey = `events:${organizerId || 'all'}:${page}:${limit}`;
    
    // Try to get from cache first
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const query = this.eventRepository.createQueryBuilder('event')
      .leftJoinAndSelect('event.organizer', 'organizer')
      .select([
        'event.id',
        'event.title',
        'event.startDate',
        'event.location',
        'event.status',
        'event.guestCount',
        'organizer.firstName',
        'organizer.lastName'
      ])
      .where('event.isActive = :isActive', { isActive: true })
      .orderBy('event.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    if (organizerId) {
      query.andWhere('event.organizerId = :organizerId', { organizerId });
    }

    const [events, total] = await query.getManyAndCount();

    const result = {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };

    // Cache for 5 minutes
    await this.redisService.set(cacheKey, result, 300);
    
    return result;
  }

  async findOne(id: string) {
    const cacheKey = `event:${id}`;
    
    // Try cache first
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const event = await this.eventRepository.findOne({
      where: { id, isActive: true },
      relations: ['guests', 'organizer'],
      select: {
        organizer: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        }
      }
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    // Cache for 10 minutes
    await this.redisService.set(cacheKey, event, 600);
    
    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.eventRepository.findOne({ 
      where: { id, isActive: true } 
    });
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    Object.assign(event, updateEventDto);
    const updatedEvent = await this.eventRepository.save(event);
    
    // Invalidate caches
    await this.redisService.del(`event:${id}`);
    await this.redisService.delPattern(`user:${event.organizerId}:events:*`);
    
    return updatedEvent;
  }

  async remove(id: string) {
    const event = await this.eventRepository.findOne({ 
      where: { id, isActive: true } 
    });
    
    if (!event) {
      throw new NotFoundException('Event not found');
    }
    
    // Soft delete by setting isActive to false
    event.isActive = false;
    await this.eventRepository.save(event);
    
    // Invalidate caches
    await this.redisService.del(`event:${id}`);
    await this.redisService.delPattern(`user:${event.organizerId}:events:*`);
    
    return { message: 'Event deleted successfully' };
  }

  async getEventGuests(id: string) {
    const cacheKey = `event:${id}:guests`;
    
    const cached = await this.redisService.get(cacheKey);
    if (cached) {
      return cached;
    }

    const guests = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoinAndSelect('event.guests', 'guest')
      .where('event.id = :id AND event.isActive = :isActive', { 
        id, 
        isActive: true 
      })
      .select([
        'guest.id',
        'guest.firstName',
        'guest.lastName',
        'guest.email',
        'guest.checkedIn',
        'guest.checkInTime',
        'guest.status'
      ])
      .getOne();

    if (!guests) {
      throw new NotFoundException('Event not found');
    }

    // Cache for 2 minutes (guests data changes frequently)
    await this.redisService.set(cacheKey, guests.guests, 120);
    
    return guests.guests;
  }

  async updateGuestCount(eventId: string) {
    const count = await this.eventRepository
      .createQueryBuilder('event')
      .leftJoin('event.guests', 'guest')
      .where('event.id = :eventId', { eventId })
      .andWhere('guest.status != :status', { status: 'no-show' })
      .getCount();

    await this.eventRepository.update(eventId, { guestCount: count });
    
    // Invalidate cache
    await this.redisService.del(`event:${eventId}`);
  }
}
