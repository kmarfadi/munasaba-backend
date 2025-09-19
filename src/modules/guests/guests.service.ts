import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guest } from './guest.entity';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestsService {
  constructor(
    @InjectRepository(Guest)
    private guestRepository: Repository<Guest>,
  ) {}

  async create(createGuestDto: CreateGuestDto) {
    const guest = this.guestRepository.create(createGuestDto);
    return this.guestRepository.save(guest);
  }

  async findAll(eventId?: string) {
    const query = this.guestRepository.createQueryBuilder('guest')
      .leftJoinAndSelect('guest.event', 'event');

    if (eventId) {
      query.where('guest.eventId = :eventId', { eventId });
    }

    return query.getMany();
  }

  async findOne(id: string) {
    const guest = await this.guestRepository.findOne({
      where: { id },
      relations: ['event'],
    });

    if (!guest) {
      throw new NotFoundException('Guest not found');
    }

    return guest;
  }

  async update(id: string, updateGuestDto: UpdateGuestDto) {
    const guest = await this.findOne(id);
    Object.assign(guest, updateGuestDto);
    return this.guestRepository.save(guest);
  }

  async remove(id: string) {
    const guest = await this.findOne(id);
    await this.guestRepository.remove(guest);
    return { message: 'Guest deleted successfully' };
  }

  async checkIn(id: string) {
    const guest = await this.findOne(id);
    
    if (guest.checkedIn) {
      throw new BadRequestException('Guest is already checked in');
    }

    guest.checkedIn = true;
    guest.checkInTime = new Date();
    
    return this.guestRepository.save(guest);
  }

  async checkOut(id: string) {
    const guest = await this.findOne(id);
    
    if (!guest.checkedIn) {
      throw new BadRequestException('Guest is not checked in');
    }

    guest.checkedIn = false;
    guest.checkOutTime = new Date();
    
    return this.guestRepository.save(guest);
  }
}
