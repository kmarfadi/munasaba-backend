import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('RequestInterceptor');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const { method, url, body, query, params } = request;
    const user = (request as any).user;
    const startTime = Date.now();

    // Log request details
    this.logger.log(
      `[${method}] ${url} - User: ${user?.id || 'anonymous'} - Body: ${JSON.stringify(body)} - Query: ${JSON.stringify(query)} - Params: ${JSON.stringify(params)}`,
    );

    return next.handle().pipe(
      tap({
        next: (data) => {
          const duration = Date.now() - startTime;
          this.logger.log(
            `[${method}] ${url} - Success - Duration: ${duration}ms - Response size: ${JSON.stringify(data).length} bytes`,
          );
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          this.logger.error(
            `[${method}] ${url} - Error - Duration: ${duration}ms - Error: ${error.message}`,
            error.stack,
          );
        },
      }),
    );
  }
}
