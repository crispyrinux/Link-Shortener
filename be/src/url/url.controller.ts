import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
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
import { UpdateUrlDto } from './dto/update-url.dto';

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

  @ApiOperation({ summary: 'Update a short URL owned by the authenticated user' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  @ApiBody({ type: UpdateUrlDto })
  @ApiResponse({ status: 200, description: 'Short URL updated successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('urls/:id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUrlDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.urlService.updateUserUrl(id, dto, req.user.id);
  }

  @ApiOperation({ summary: 'Delete a short URL owned by the authenticated user' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  @ApiResponse({ status: 200, description: 'Short URL deleted successfully' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete('urls/:id')
  remove(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.urlService.deleteUserUrl(id, req.user.id);
  }

  @ApiOperation({ summary: 'Get stats for a users short URL by id' })
  @ApiParam({ name: 'id', example: 'clx123abc456' })
  @ApiResponse({ status: 200, description: 'Short URL stats returned' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('urls/:id/stats')
  getUrlStats(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.urlService.getUrlStats(id, req.user.id);
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
