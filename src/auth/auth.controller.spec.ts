import { Test } from '@nestjs/testing';
import { Task, TaskStatus } from '../database/tasks.entity';

import { getRepositoryToken } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from '../database/user.entity';
import { LoginAuthDto, RegisterAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        JwtService,
        { provide: getRepositoryToken(User), useFactory: jest.fn() },
      ],
    }).compile();

    authController = moduleRef.get<AuthController>(AuthController);
    authService = moduleRef.get<AuthService>(AuthService);
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('register', () => {
    it('should register new user', async () => {
      const mockAuthCredentials: RegisterAuthDto = {
        username: 'test',
        password: 'test',
      };

      jest.spyOn(authService, 'signup').mockResolvedValue(null);

      const result = await authController.register(mockAuthCredentials);
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should signin user and get user auth token', async () => {
      const mockAuthCredentials: LoginAuthDto = {
        username: 'test',
        password: 'test',
      };

      const response = { token: 'testToken' };

      jest.spyOn(authService, 'signin').mockResolvedValue(response);

      const result = await authController.login(mockAuthCredentials);

      expect(result).toEqual(response);
    });
  });
});
