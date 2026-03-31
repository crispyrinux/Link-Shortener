import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(private prisma: PrismaService) {}

  private generateShortCode(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async createShortUrl(dto: CreateUrlDto) {
    const { originalUrl, customAlias } = dto;

    let shortCode = customAlias || this.generateShortCode();

    // cek alias sudah dipakai
    const existing = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (existing && customAlias) {
      throw new BadRequestException('Custom alias already in use');
    }

    // handle collision kalau random
    while (!customAlias && existing) {
      shortCode = this.generateShortCode();
    }

    const url = await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode,
      },
    });

    return {
      id: url.id,
      shortCode: url.shortCode,
      shortUrl: `${process.env.BASE_URL}/${url.shortCode}`,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
    };
  }

  async redirect(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    if (url.expiresAt && new Date() > url.expiresAt) {
      throw new NotFoundException('Link expired');
    }

    await this.prisma.url.update({
      where: { shortCode },
      data: {
        clickCount: {
          increment: 1,
        },
      },
    });

    return url.originalUrl;
  }

  async getStats(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return {
      id: url.id,
      shortCode: url.shortCode,
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
    };
  }
}