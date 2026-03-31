import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  create(@Body() dto: CreateUrlDto) {
    return this.urlService.createShortUrl(dto);
  }

  @Get('stats/:shortCode')
  getStats(@Param('shortCode') shortCode: string) {
    return this.urlService.getStats(shortCode);
  }

  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.redirect(shortCode);
    return res.redirect(url);
  }
}