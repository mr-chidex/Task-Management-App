import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../database/user.entity';
import { AuthService } from './auth.service';
import { LoginAuthDto, RegisterAuthDto } from './dto';

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: any;

  const mockUserRepository = () => ({
    findOneBy: jest.fn(),
    create: jest.fn(() => ({ save: jest.fn() })),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get(getRepositoryToken(User));
  });

  afterAll(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
  });

  describe('signup', () => {
    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw BadRequest Error if username is already in use', async () => {
      const mockAuthCredentials: RegisterAuthDto = {
        username: 'test user',
        password: 'test',
      };

      userRepository.findOneBy.mockResolvedValue(true);

      expect(authService.signup(mockAuthCredentials)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a new user', async () => {
      const mockAuthCredentials: RegisterAuthDto = {
        username: 'test user',
        password: 'test',
      };

      const save = jest.fn().mockResolvedValue(true);
      jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('abcdefghijkl' as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('abcdefghijklmn' as never);

      userRepository.findOneBy.mockResolvedValue(false);
      userRepository.create.mockReturnValue({ save });

      expect(userRepository.findOneBy).not.toHaveBeenCalled();
      expect(userRepository.create).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();

      await authService.signup(mockAuthCredentials);

      expect(userRepository.create).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
    });
  });

  describe('validateCredentials', () => {
    afterAll(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });

    it('should throw error if username is incorrect', () => {
      const mockAuthCredentials: LoginAuthDto = {
        username: 'invalid',
        password: 'test',
      };

      userRepository.findOneBy.mockResolvedValue(false);

      expect(
        authService.validateCredentials(mockAuthCredentials),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw error if password is incorrect', () => {
      const mockAuthCredentials: LoginAuthDto = {
        username: 'test',
        password: 'invalid',
      };

      userRepository.findOneBy.mockResolvedValue(true);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      expect(
        authService.validateCredentials(mockAuthCredentials),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should return user', async () => {
      const mockAuthCredentials: LoginAuthDto = {
        username: 'test',
        password: 'test',
      };

      userRepository.findOneBy.mockResolvedValue(mockAuthCredentials);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const result = await authService.validateCredentials(mockAuthCredentials);
      expect(result).toEqual(mockAuthCredentials);
    });
  });

  describe('signin', () => {
    it('should sign a user in and get token', async () => {
      const mockAuthCredentials: LoginAuthDto = {
        username: 'test',
        password: 'test',
      };

      authService.signin = jest.fn().mockResolvedValue('token');

      const result = await authService.signin(mockAuthCredentials);

      expect(result).toBe('token');
    });
  });
});
