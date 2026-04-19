import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: {
    register: jest.Mock;
    login: jest.Mock;
  };

  beforeEach(async () => {
    authService = {
      register: jest.fn(),
      login: jest.fn(),
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

  it('passes register dto to service', async () => {
    authService.register.mockResolvedValue({ message: 'ok' });

    const result = await controller.register({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    });

    expect(authService.register).toHaveBeenCalledWith({
      name: 'John',
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(result).toEqual({ message: 'ok' });
  });

  it('passes login dto to service', async () => {
    authService.login.mockResolvedValue({ message: 'ok' });

    const result = await controller.login({
      email: 'john@example.com',
      password: 'secret123',
    });

    expect(authService.login).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'secret123',
    });
    expect(result).toEqual({ message: 'ok' });
  });

  it('returns the authenticated user from me', () => {
    const result = controller.me({
      user: {
        id: 'user-1',
        email: 'john@example.com',
        name: 'John',
      },
    });

    expect(result).toEqual({
      id: 'user-1',
      email: 'john@example.com',
      name: 'John',
    });
  });
});
