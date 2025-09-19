import { Controller, Get, UseGuards, Query, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(@Query('userId') userId?: string) {
    return this.analyticsService.getDashboard(userId);
  }

  @Get('events/stats')
  getEventStats(@Query('userId') userId?: string) {
    return this.analyticsService.getEventStats(userId);
  }

  @Get('guests/stats')
  getGuestStats(@Query('userId') userId?: string) {
    return this.analyticsService.getGuestStats(userId);
  }

  @Get('events/:id/analytics')
  getEventAnalytics(@Param('id') id: string) {
    return this.analyticsService.getEventAnalytics(id);
  }

  @Get('attendance/trends')
  getAttendanceTrends(@Query('userId') userId?: string, @Query('period') period: string = '30d') {
    return this.analyticsService.getAttendanceTrends(userId, period);
  }
}

