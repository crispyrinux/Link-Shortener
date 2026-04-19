import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { scryptSync } from 'node:crypto';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: {
    user: {
      create: jest.Mock;
      findUnique: jest.Mock;
    };
  };
  let jwtService: {
    signAsync: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        create: jest.fn(),
        findUnique: jest.fn(),
      },
    };
    jwtService = {
      signAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: JwtService,
          useValue: jwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('registers a user and returns a token', async () => {
    prismaService.user.create.mockResolvedValue({
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      password: 'stored-password',
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-20T00:00:00.000Z'),
    });
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.register({
      name: ' John ',
      email: ' John@Example.com ',
      password: 'secret123',
    });

    expect(prismaService.user.create).toHaveBeenCalledTimes(1);
    expect(prismaService.user.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        name: 'John',
        email: 'john@example.com',
      }),
    });

    const createArg = prismaService.user.create.mock.calls[0][0].data.password;
    expect(createArg).not.toBe('secret123');
    expect(createArg).toMatch(/^[0-9a-f]+:[0-9a-f]+$/);

    expect(jwtService.signAsync).toHaveBeenCalledWith({
      sub: 'user-1',
      email: 'john@example.com',
      name: 'John',
    });
    expect(result).toEqual({
      message: 'Register successful',
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date('2026-04-20T00:00:00.000Z'),
        updatedAt: new Date('2026-04-20T00:00:00.000Z'),
      },
    });
  });

  it('throws conflict when email is already registered', async () => {
    prismaService.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );

    await expect(
      service.register({
        name: 'John',
        email: 'john@example.com',
        password: 'secret123',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('logs in a user with valid credentials', async () => {
    const salt = 'abcdef1234567890abcdef1234567890';
    const storedHash = scryptSync('secret123', salt, 64).toString('hex');

    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
      password: `${salt}:${storedHash}`,
      createdAt: new Date('2026-04-20T00:00:00.000Z'),
      updatedAt: new Date('2026-04-20T00:00:00.000Z'),
    });
    jwtService.signAsync.mockResolvedValue('jwt-token');

    const result = await service.login({
      email: ' John@Example.com ',
      password: 'secret123',
    });

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { email: 'john@example.com' },
    });
    expect(result).toEqual({
      message: 'Login successful',
      accessToken: 'jwt-token',
      user: {
        id: 'user-1',
        name: 'John',
        email: 'john@example.com',
        createdAt: new Date('2026-04-20T00:00:00.000Z'),
        updatedAt: new Date('2026-04-20T00:00:00.000Z'),
      },
    });
  });

  it('rejects invalid credentials', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      service.login({
        email: 'john@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
