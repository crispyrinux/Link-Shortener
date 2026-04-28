import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  ACCESS_TOKEN_COOKIE_OPTIONS,
  AUTH_COOKIE_BASE_OPTIONS,
  REFRESH_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_OPTIONS,
} from './auth.constants';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import type { AuthenticatedRequest } from './types/auth-request.type';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResult = await this.authService.register(registerDto);
    this.setAuthCookies(
      response,
      authResult.accessToken,
      authResult.refreshToken,
    );

    return {
      message: authResult.message,
      user: authResult.user,
    };
  }

  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResult = await this.authService.login(loginDto);
    this.setAuthCookies(
      response,
      authResult.accessToken,
      authResult.refreshToken,
    );

    return {
      message: authResult.message,
      user: authResult.user,
    };
  }

  @ApiOperation({ summary: 'Refresh authentication cookies' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @HttpCode(HttpStatus.OK)
  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const authResult = await this.authService.refreshTokens(
      this.getCookie(request, REFRESH_TOKEN_COOKIE_NAME),
    );
    this.setAuthCookies(
      response,
      authResult.accessToken,
      authResult.refreshToken,
    );

    return {
      message: authResult.message,
      user: authResult.user,
    };
  }

  @ApiOperation({ summary: 'Clear authentication cookies' })
  @ApiResponse({ status: 200, description: 'Logout successful' })
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.logout(
      this.getCookie(request, REFRESH_TOKEN_COOKIE_NAME),
    );
    this.clearAuthCookies(response);

    return {
      message: 'Logout successful',
    };
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get authenticated user profile' })
  @ApiResponse({ status: 200, description: 'Authenticated user returned' })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  me(@Req() req: AuthenticatedRequest) {
    return req.user;
  }

  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
  ) {
    response.cookie(
      ACCESS_TOKEN_COOKIE_NAME,
      accessToken,
      ACCESS_TOKEN_COOKIE_OPTIONS,
    );
    response.cookie(
      REFRESH_TOKEN_COOKIE_NAME,
      refreshToken,
      REFRESH_TOKEN_COOKIE_OPTIONS,
    );
  }

  private clearAuthCookies(response: Response) {
    response.clearCookie(ACCESS_TOKEN_COOKIE_NAME, AUTH_COOKIE_BASE_OPTIONS);
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME, AUTH_COOKIE_BASE_OPTIONS);
  }

  private getCookie(request: Request, cookieName: string) {
    const cookies = request.cookies as Record<string, unknown> | undefined;
    const cookieValue = cookies?.[cookieName];

    return typeof cookieValue === 'string' ? cookieValue : undefined;
  }
}
