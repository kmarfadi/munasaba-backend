import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName } = registerDto;
    
    await this.checkEmailExists(email);
    
    const hashedPassword = await this.hashPassword(password);
    const user = await this.createUser({ email, password: hashedPassword, firstName, lastName });

    return this.generateAuthResponse(user);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    
    const user = await this.validateCredentials(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateAuthResponse(user);
  }

  async refreshToken(user: any) {
    const payload = this.createJwtPayload(user);
    return { token: this.jwtService.sign(payload) };
  }

  // =============================================
  // PRIVATE HELPER METHODS
  // =============================================

  private async checkEmailExists(email: string): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async createUser(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    return this.userRepository.save(user);
  }

  private async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { email } });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  private createJwtPayload(user: User): { sub: string, email: string } {
    return { sub: user.id, email: user.email };
  }

  private generateAuthResponse(user: User) {
    const payload = this.createJwtPayload(user);
    const token = this.jwtService.sign(payload);

    return {
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      token,
    };
  }
}