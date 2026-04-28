import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import QRCode from 'qrcode';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

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

    return this.serializeUrl(url);
  }

  async findUserUrls(userId: string) {
    const urls = await this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(urls.map((url) => this.serializeUrl(url)));
  }

  async updateUserUrl(urlId: string, dto: UpdateUrlDto, userId: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        id: urlId,
        userId,
      },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    let shortCode = url.shortCode;

    if (dto.customAlias !== undefined) {
      const normalizedAlias = dto.customAlias.trim();

      if (normalizedAlias !== url.shortCode) {
        shortCode = await this.ensureCustomAliasIsAvailable(
          normalizedAlias,
          url.id,
        );
      }
    }

    const updatedUrl = await this.prisma.url.update({
      where: { id: url.id },
      data: {
        originalUrl: dto.originalUrl ?? url.originalUrl,
        shortCode,
      },
    });

    return this.serializeUrl(updatedUrl);
  }

  async deleteUserUrl(urlId: string, userId: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        id: urlId,
        userId,
      },
      select: { id: true },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    await this.prisma.url.delete({
      where: { id: url.id },
    });

    return {
      id: url.id,
      message: 'Short URL deleted successfully',
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

  async getUrlStats(urlId: string, userId: string) {
    const url = await this.prisma.url.findFirst({
      where: {
        id: urlId,
        userId,
      },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    return this.serializeUrl(url);
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

    return this.serializeUrl(url);
  }

  private async ensureCustomAliasIsAvailable(
    customAlias: string,
    currentUrlId?: string,
  ) {
    const normalizedAlias = customAlias.trim();
    const existing = await this.prisma.url.findUnique({
      where: { shortCode: normalizedAlias },
      select: { id: true },
    });

    if (existing && existing.id !== currentUrlId) {
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
      color: {
        dark: '#0a1630',
        light: '#e8fbff',
      },
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

  private async serializeUrl(url: {
    id: string;
    shortCode: string;
    originalUrl: string;
    clickCount: number;
    createdAt: Date;
    updatedAt: Date;
    expiresAt: Date | null;
  }) {
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
}
