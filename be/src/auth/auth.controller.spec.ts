import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
} from './auth.constants';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
    refreshTokens: jest.Mock;
    logout: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
      refreshTokens: jest.fn(),
      logout: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authService,
        },
        {
          provide: JwtAuthGuard,
          useValue: {
            canActivate: jest.fn(() => true),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('passes register dto to service and sets auth cookies', async () => {
    const response = {
      cookie: jest.fn(),
    };

    authService.register.mockResolvedValue({
      message: 'ok',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 'user-1' },
    });

    const result = await controller.register(
      {
        name: 'John',
        email: 'john@example.com',
        password: 'secret123',
      },
      response as any,
    );

    expect(authService.register).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(response.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE_NAME,
      'access-token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }),
    );
    expect(response.cookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE_NAME,
      'refresh-token',
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }),
    );
    expect(result).toEqual({
      message: 'ok',
      user: { id: 'user-1' },
    });
  });

  it('passes login dto to service and sets auth cookies', async () => {
    const response = {
      cookie: jest.fn(),
    };

    authService.login.mockResolvedValue({
      message: 'ok',
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
      user: { id: 'user-1' },
    });

    const result = await controller.login(
      {
        email: 'john@example.com',
        password: 'secret123',
      },
      response as any,
    );

    expect(authService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      message: 'ok',
      user: { id: 'user-1' },
    });
  });

  it('reads refresh token from cookie and rotates auth cookies', async () => {
    const request = {
      cookies: {
        [REFRESH_TOKEN_COOKIE_NAME]: 'refresh-token',
      },
    };
    const response = {
      cookie: jest.fn(),
    };

    authService.refreshTokens.mockResolvedValue({
      message: 'Token refreshed',
      accessToken: 'new-access-token',
      refreshToken: 'new-refresh-token',
      user: { id: 'user-1' },
    });

    const result = await controller.refresh(request as any, response as any);

    expect(authService.refreshTokens).toHaveBeenCalledWith('refresh-token');
    expect(response.cookie).toHaveBeenCalledTimes(2);
    expect(result).toEqual({
      message: 'Token refreshed',
      user: { id: 'user-1' },
    });
  });

  it('clears auth cookies on logout', async () => {
    const request = {
      cookies: {
        [REFRESH_TOKEN_COOKIE_NAME]: 'refresh-token',
      },
    };
    const response = {
      clearCookie: jest.fn(),
    };

    authService.logout.mockResolvedValue(undefined);

    const result = await controller.logout(request as any, response as any);

    expect(authService.logout).toHaveBeenCalledWith('refresh-token');
    expect(response.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE_NAME,
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }),
    );
    expect(response.clearCookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE_NAME,
      expect.objectContaining({
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      }),
    );
    expect(result).toEqual({ message: 'Logout successful' });
  });

  it('returns the authenticated user from me', () => {
    const result = controller.me({
      user: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John',
      },
    } as any);

    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      name: 'John',
    });
  });
});
