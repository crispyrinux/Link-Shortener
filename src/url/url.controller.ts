import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@ApiTags('url')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: 'Create a short URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'Short URL created successfully' })
  @Post('shorten')
  create(@Body() dto: CreateUrlDto) {
    return this.urlService.createShortUrl(dto);
  }

  @ApiOperation({ summary: 'Get stats for a short URL' })
  @ApiParam({ name: 'shortCode', example: 'abc123' })
  @ApiResponse({ status: 200, description: 'Short URL stats returned' })
  @Get('stats/:shortCode')
  getStats(@Param('shortCode') shortCode: string) {
    return this.urlService.getStats(shortCode);
  }

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'shortCode', example: 'abc123' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @Get(':shortCode')
  async redirect(
    @Param('shortCode') shortCode: string,
    @Res() res: Response,
  ) {
    const url = await this.urlService.redirect(shortCode);
    return res.redirect(url);
  }
}
