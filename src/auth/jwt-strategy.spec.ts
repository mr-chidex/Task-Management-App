import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../database/user.entity';
import { JWTPaload } from './interface/jwt.interfaces';
import { JwtStrategy } from './jwt-strategy';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: any;

  const mockUserRepository = () => ({
    findOneBy: jest.fn(),
  });

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
      ],
    }).compile();

    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
    userRepository = module.get(getRepositoryToken(User));
  });

  describe('validate', () => {
    it('should validate and return user', async () => {
      const mockUserPayload: JWTPaload = { username: 'testUser' };
      const mockUser = { username: 'testUser' };

      userRepository.findOneBy.mockResolvedValue(mockUser);
      const result = await jwtStrategy.validate(mockUserPayload);

      expect(userRepository.findOneBy).toHaveBeenCalledWith({
        username: mockUserPayload.username,
      });
      expect(result).toBe(mockUser);
    });

    it('should throw unauthorized error if user is not found', () => {
      const mockUserPayload: JWTPaload = { username: 'testUser' };
      userRepository.findOneBy.mockResolvedValue(null);

      expect(jwtStrategy.validate(mockUserPayload)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
