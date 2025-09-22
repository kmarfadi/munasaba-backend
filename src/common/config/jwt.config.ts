import { ConfigService } from '@nestjs/config';

export const jwtConfig = (configService: ConfigService) => ({
  secret: process.env.JWT_SECRET_KEY,   
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
});
