import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import type { AuthenticatedRequest } from '../auth/types/auth-request.type';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';

@ApiTags('url')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @ApiOperation({ summary: 'Create a short URL' })
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'Short URL created successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('shorten')
  create(@Body() dto: CreateUrlDto, @Req() req: AuthenticatedRequest) {
    return this.urlService.createShortUrl(dto, req.user.id);
  }

  @ApiOperation({ summary: 'List short URLs created by the authenticated user' })
  @ApiResponse({ status: 200, description: 'User URLs returned successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('urls')
  findMyUrls(@Req() req: AuthenticatedRequest) {
    return this.urlService.findUserUrls(req.user.id);
  }

  @ApiOperation({ summary: 'Get stats for a short URL' })
  @ApiParam({ name: 'shortCode', example: 'abc123' })
  @ApiResponse({ status: 200, description: 'Short URL stats returned' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('stats/:shortCode')
  getStats(
    @Param('shortCode') shortCode: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.urlService.getStats(shortCode, req.user.id);
  }

  @ApiOperation({ summary: 'Redirect to the original URL' })
  @ApiParam({ name: 'shortCode', example: 'abc123' })
  @ApiResponse({ status: 302, description: 'Redirect to original URL' })
  @Get(':shortCode')
  async redirect(@Param('shortCode') shortCode: string, @Res() res: Response) {
    const url = await this.urlService.redirect(shortCode);
    return res.redirect(url);
  }
}
