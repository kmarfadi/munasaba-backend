import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './controllers/analytics.controller';
import { AnalyticsService } from './services/analytics.service';
import { Event } from '@/modules/events/entities/event.entity';
import { Guest } from '@/modules/guests/entities/guest.entity';
import { EventsModule } from '../events/events.module';
import { GuestsModule } from '../guests/guests.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Guest]),
    EventsModule,
    GuestsModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
