import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from '../entities/event.entity';
import { CreateEventDto } from '../dto/create-event.dto';
import { UpdateEventDto } from '../dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async create(createEventDto: CreateEventDto, userId: string) {
    const event = this.eventRepository.create({
      ...createEventDto,
      organizerId: userId,
    });

    return this.eventRepository.save(event);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [events, total] = await this.eventRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      events,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['guests'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(id: string, updateEventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    
    Object.assign(event, updateEventDto);
    return this.eventRepository.save(event);
  }

  async remove(id: string) {
    const event = await this.findOne(id);
    await this.eventRepository.remove(event);
    return { message: 'Event deleted successfully' };
  }

  async getEventGuests(id: string) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['guests'],
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event.guests;
  }
}
