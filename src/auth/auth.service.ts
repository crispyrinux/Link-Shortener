import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const email = registerDto.email.trim().toLowerCase();
    const name = registerDto.name.trim();
    const hashedPassword = this.hashPassword(registerDto.password);

    try {
      const user = await this.prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      return {
        message: 'Register successful',
        accessToken: await this.generateAccessToken(user),
        user: this.serializeUser(user),
      };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already registered');
      }

      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !this.verifyPassword(loginDto.password, user.password)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      accessToken: await this.generateAccessToken(user),
      user: this.serializeUser(user),
    };
  }

  private hashPassword(password: string) {
    const salt = randomBytes(16).toString('hex');
    const hash = scryptSync(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
  }

  private verifyPassword(password: string, storedPassword: string) {
    const [salt, storedHash] = storedPassword.split(':');

    if (!salt || !storedHash) {
      return false;
    }

    const hashedBuffer = scryptSync(password, salt, 64);
    const storedBuffer = Buffer.from(storedHash, 'hex');

    if (storedBuffer.length !== hashedBuffer.length) {
      return false;
    }

    return timingSafeEqual(storedBuffer, hashedBuffer);
  }

  private generateAccessToken(user: User) {
    return this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
      name: user.name,
    });
  }

  private serializeUser(user: User) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
