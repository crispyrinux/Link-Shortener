import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Injectable()
export class UrlService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  private generateShortCode(length = 6): string {
    const chars =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
  }

  async createShortUrl(dto: CreateUrlDto, userId: string) {
    const { originalUrl, customAlias } = dto;
    const shortCode = customAlias
      ? await this.ensureCustomAliasIsAvailable(customAlias)
      : await this.generateUniqueShortCode();

    const url = await this.prisma.url.create({
      data: {
        originalUrl,
        shortCode,
        userId,
      },
    });
    const shortUrl = this.buildShortUrl(url.shortCode);

    return {
      id: url.id,
      shortCode: url.shortCode,
      shortUrl,
      qrCodeDataUrl: await this.generateQrCodeDataUrl(shortUrl),
      originalUrl: url.originalUrl,
      clickCount: url.clickCount,
      createdAt: url.createdAt,
      updatedAt: url.updatedAt,
      expiresAt: url.expiresAt,
    };
  }

  async findUserUrls(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      urls.map(async (url) => {
        const shortUrl = this.buildShortUrl(url.shortCode);

        return {
          id: url.id,
          shortCode: url.shortCode,
          shortUrl,
          qrCodeDataUrl: await this.generateQrCodeDataUrl(shortUrl),
          originalUrl: url.originalUrl,
          clickCount: url.clickCount,
          createdAt: url.createdAt,
          updatedAt: url.updatedAt,
          expiresAt: url.expiresAt,
        };
      }),
    );
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

  async getStats(shortCode: string, userId: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        shortCode,
        userId,
      },
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

  private async ensureCustomAliasIsAvailable(customAlias: string) {
    const normalizedAlias = customAlias.trim();
    const existing = await this.prisma.url.findUnique({
      where: { shortCode: normalizedAlias },
      select: { id: true },
    });

    if (existing) {
      throw new BadRequestException('Custom alias already in use');
    }

    return normalizedAlias;
  }

  private buildShortUrl(shortCode: string) {
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost:3000';

    return `${baseUrl.replace(/\/+$/, '')}/${shortCode}`;
  }

  private generateQrCodeDataUrl(shortUrl: string) {
    return QRCode.toDataURL(shortUrl, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 240,
    });
  }

  private async generateUniqueShortCode() {
    let shortCode = this.generateShortCode();

    while (
      await this.prisma.url.findUnique({
        where: { shortCode },
        select: { id: true },
      })
    ) {
      shortCode = this.generateShortCode();
    }

    return shortCode;
  }
}
