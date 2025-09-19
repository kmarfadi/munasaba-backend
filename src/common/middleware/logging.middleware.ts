import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction): void {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('User-Agent') || '';
    const startTime = Date.now();

    // Log incoming request
    this.logger.log(
      `Incoming Request: ${method} ${originalUrl} - ${ip} - ${userAgent}`,
    );

    // Override res.end to log response
    const originalEnd = res.end;
    res.end = function (chunk?: any, encoding?: any) {
      const duration = Date.now() - startTime;
      const { statusCode } = res;
      
      // Log response
      const logger = new Logger('HTTP');
      logger.log(
        `Outgoing Response: ${method} ${originalUrl} - ${statusCode} - ${duration}ms`,
      );
      
      // Call original end method and return the result
      return originalEnd.call(this, chunk, encoding);
    };

    next();
  }
}
