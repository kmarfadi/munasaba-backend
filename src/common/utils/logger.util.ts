import { Logger } from '@nestjs/common';

export class LoggerUtil {
  private static readonly logger = new Logger('Application');

  static logRequest(method: string, url: string, ip: string, userAgent: string): void {
    this.logger.log(`[REQUEST] ${method} ${url} - IP: ${ip} - UserAgent: ${userAgent}`);
  }

  static logResponse(method: string, url: string, statusCode: number, duration: number): void {
    this.logger.log(`[RESPONSE] ${method} ${url} - Status: ${statusCode} - Duration: ${duration}ms`);
  }

  static logError(error: string, stack?: string, context?: string): void {
    this.logger.error(`[ERROR] ${context ? `[${context}] ` : ''}${error}`, stack);
  }

  static logInfo(message: string, context?: string): void {
    this.logger.log(`[INFO] ${context ? `[${context}] ` : ''}${message}`);
  }

  static logWarning(message: string, context?: string): void {
    this.logger.warn(`[WARNING] ${context ? `[${context}] ` : ''}${message}`);
  }

  static logDebug(message: string, context?: string): void {
    this.logger.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${message}`);
  }
}
