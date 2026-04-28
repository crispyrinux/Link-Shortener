import { Test, TestingModule } from '@nestjs/testing';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

describe('UrlController', () => {
  let controller: UrlController;
  let urlService: {
    createShortUrl: jest.Mock;
    getStats: jest.Mock;
    redirect: jest.Mock;
  };

  beforeEach(async () => {
    urlService = {
      createShortUrl: jest.fn(),
      getStats: jest.fn(),
      redirect: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlController],
      providers: [
        {
          provide: UrlService,
          useValue: urlService,
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<UrlController>(UrlController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('creates a short URL for the authenticated user', async () => {
    urlService.createShortUrl.mockResolvedValue({
      shortCode: 'abc123',
    });

    const result = await controller.create(
      {
        originalUrl: 'https://example.com',
      },
      {
        user: {
          id: 'user-1',
          email: 'john@example.com',
          name: 'John',
        },
      } as any,
    );

    expect(urlService.createShortUrl).toHaveBeenCalledWith(
      {
        originalUrl: 'https://example.com',
      },
      'user-1',
    );
    expect(result).toEqual({
      shortCode: 'abc123',
    });
  });

  it('returns stats for the authenticated owner', async () => {
    urlService.getStats.mockResolvedValue({
      shortCode: 'abc123',
      clickCount: 7,
    });

    const result = await controller.getStats(
      'abc123',
      {
        user: {
          id: 'user-1',
          email: 'john@example.com',
          name: 'John',
        },
      } as any,
    );

    expect(urlService.getStats).toHaveBeenCalledWith('abc123', 'user-1');
    expect(result).toEqual({
      shortCode: 'abc123',
      clickCount: 7,
    });
  });
});
