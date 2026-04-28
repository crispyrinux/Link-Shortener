import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtStrategy } from './jwt.strategy';

describe('JwtStrategy', () => {
  let strategy: JwtStrategy;
  let prismaService: {
    user: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prismaService = {
      user: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(() => 'test-secret'),
          },
        },
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    strategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('returns the current user from database', async () => {
    prismaService.user.findUnique.mockResolvedValue({
      id: 'user-1',
      name: 'John',
      email: 'john@example.com',
    });

    const result = await strategy.validate({
      sub: 'user-1',
      email: 'old@example.com',
      name: 'Old Name',
    });

    expect(prismaService.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-1' },
    });
    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      name: 'John',
    });
  });

  it('rejects tokens for deleted users', async () => {
    prismaService.user.findUnique.mockResolvedValue(null);

    await expect(
      strategy.validate({
        sub: 'missing-user',
        email: 'john@example.com',
        name: 'John',
      }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
