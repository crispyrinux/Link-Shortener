import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UrlService', () => {
  let service: UrlService;
  let prismaService: {
    url: {
      create: jest.Mock;
      findMany: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
  };
  let configService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    prismaService = {
      url: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
    };
    configService = {
      get: jest.fn((key: string) => {
        const config: Record<string, string> = {
          BASE_URL: 'http://localhost:3000',
        };

        return config[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('creates a short URL owned by the authenticated user', async () => {
    jest
      .spyOn(service as any, 'generateQrCodeDataUrl')
      .mockResolvedValue('data:image/png;base64,qr-code');
    prismaService.url.findUnique.mockResolvedValue(null);
    prismaService.url.create.mockResolvedValue({
      id: 'url-1',
      shortCode: 'custom-link',
      originalUrl: 'https://example.com',
      userId: 'user-1',
      clickCount: 0,
      createdAt: new Date('2026-04-22T00:00:00.000Z'),
      updatedAt: new Date('2026-04-22T00:00:00.000Z'),
      expiresAt: null,
    });

    const result = await service.createShortUrl(
      {
        originalUrl: 'https://example.com',
        customAlias: ' custom-link ',
      },
      'user-1',
    );

    expect(prismaService.url.findUnique).toHaveBeenCalledWith({
      where: { shortCode: 'custom-link' },
      select: { id: true },
    });
    expect(prismaService.url.create).toHaveBeenCalledWith({
      data: {
        originalUrl: 'https://example.com',
        shortCode: 'custom-link',
        userId: 'user-1',
      },
    });
    expect((service as any).generateQrCodeDataUrl).toHaveBeenCalledWith(
      'http://localhost:3000/custom-link',
    );
    expect(result).toEqual({
      id: 'url-1',
      shortCode: 'custom-link',
      shortUrl: 'http://localhost:3000/custom-link',
      qrCodeDataUrl: 'data:image/png;base64,qr-code',
      originalUrl: 'https://example.com',
      clickCount: 0,
      createdAt: new Date('2026-04-22T00:00:00.000Z'),
      updatedAt: new Date('2026-04-22T00:00:00.000Z'),
      expiresAt: null,
    });
  });

  it('rejects a custom alias that is already in use', async () => {
    prismaService.url.findUnique.mockResolvedValue({ id: 'url-1' });

    await expect(
      service.createShortUrl(
        {
          originalUrl: 'https://example.com',
          customAlias: 'existing-link',
        },
        'user-1',
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('keeps generating until it finds an unused short code', async () => {
    const generatedCodes = ['taken1', 'free99'];
    let codeIndex = 0;

    jest
      .spyOn(service as any, 'generateQrCodeDataUrl')
      .mockResolvedValue('data:image/png;base64,qr-code');
    jest
      .spyOn(service as any, 'generateShortCode')
      .mockImplementation(() => generatedCodes[codeIndex++]);
    prismaService.url.findUnique
      .mockResolvedValueOnce({ id: 'url-1' })
      .mockResolvedValueOnce(null);
    prismaService.url.create.mockResolvedValue({
      id: 'url-2',
      shortCode: 'free99',
      originalUrl: 'https://example.com/page',
      userId: 'user-1',
      clickCount: 0,
      createdAt: new Date('2026-04-22T00:00:00.000Z'),
      updatedAt: new Date('2026-04-22T00:00:00.000Z'),
      expiresAt: null,
    });

    const result = await service.createShortUrl(
      {
        originalUrl: 'https://example.com/page',
      },
      'user-1',
    );

    expect(prismaService.url.findUnique).toHaveBeenNthCalledWith(1, {
      where: { shortCode: 'taken1' },
      select: { id: true },
    });
    expect(prismaService.url.findUnique).toHaveBeenNthCalledWith(2, {
      where: { shortCode: 'free99' },
      select: { id: true },
    });
    expect(result.shortCode).toBe('free99');
    expect(result.qrCodeDataUrl).toBe('data:image/png;base64,qr-code');
  });

  it('lists URLs for the authenticated user in descending creation order', async () => {
    jest
      .spyOn(service as any, 'generateQrCodeDataUrl')
      .mockResolvedValue('data:image/png;base64,qr-code-list');
    prismaService.url.findMany.mockResolvedValue([
      {
        id: 'url-2',
        shortCode: 'latest1',
        originalUrl: 'https://example.com/latest',
        clickCount: 9,
        createdAt: new Date('2026-04-23T00:00:00.000Z'),
        updatedAt: new Date('2026-04-23T00:00:00.000Z'),
        expiresAt: null,
      },
    ]);

    const result = await service.findUserUrls('user-1');

    expect(prismaService.url.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { createdAt: 'desc' },
    });
    expect((service as any).generateQrCodeDataUrl).toHaveBeenCalledWith(
      'http://localhost:3000/latest1',
    );
    expect(result).toEqual([
      {
        id: 'url-2',
        shortCode: 'latest1',
        shortUrl: 'http://localhost:3000/latest1',
        qrCodeDataUrl: 'data:image/png;base64,qr-code-list',
        originalUrl: 'https://example.com/latest',
        clickCount: 9,
        createdAt: new Date('2026-04-23T00:00:00.000Z'),
        updatedAt: new Date('2026-04-23T00:00:00.000Z'),
        expiresAt: null,
      },
    ]);
  });

  it('returns stats only for the owning user', async () => {
    prismaService.url.findFirst.mockResolvedValue({
      id: 'url-1',
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clickCount: 3,
      createdAt: new Date('2026-04-22T00:00:00.000Z'),
    });

    const result = await service.getStats('abc123', 'user-1');

    expect(prismaService.url.findFirst).toHaveBeenCalledWith({
      where: {
        shortCode: 'abc123',
        userId: 'user-1',
      },
    });
    expect(result).toEqual({
      id: 'url-1',
      shortCode: 'abc123',
      originalUrl: 'https://example.com',
      clickCount: 3,
      createdAt: new Date('2026-04-22T00:00:00.000Z'),
    });
  });

  it('throws not found when a user requests stats for another users URL', async () => {
    prismaService.url.findFirst.mockResolvedValue(null);

    await expect(service.getStats('abc123', 'user-2')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
