import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { Event } from './event.entity';
import { RedisCacheModule } from '../../common/cache/cache.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Event]),
    RedisCacheModule,
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
