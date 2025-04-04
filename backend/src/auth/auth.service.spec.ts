import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/users.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: MockRepository<User>;
  let jwtService: JwtService;

  type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

  beforeEach(async () => {
    const mockUserRepository: MockRepository<User> = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signUp', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      userRepository.findOne.mockResolvedValue(null);
      userRepository.create.mockReturnValue({ username: 'testuser', password: 'hashedPassword' } as User);
      userRepository.save.mockResolvedValue({} as User);

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');

      await expect(authService.signUp({ username: 'testuser', password: 'password' })).resolves.not.toThrow();
    });

    it('deve lançar uma exceção se o usuário já existir', async () => {
      userRepository.findOne.mockResolvedValue({ username: 'testuser' } as User);

      await expect(authService.signUp({ username: 'testuser', password: 'password' })).rejects.toThrow(ConflictException);
    });
  });

  describe('signIn', () => {
    it('deve retornar um token de acesso e o ID do usuário ao fornecer credenciais válidas', async () => {
      const user = { id: 1, username: 'testuser', password: 'hashedPassword' } as User;
      userRepository.findOne.mockResolvedValue(user);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      (jwtService.sign as jest.Mock).mockReturnValue('accessToken');

      const result = await authService.signIn({ username: 'testuser', password: 'password' });
      expect(result).toEqual({ accessToken: 'accessToken', userId: 1 });
    });

    it('deve lançar uma exceção ao fornecer credenciais inválidas', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(authService.signIn({ username: 'testuser', password: 'password' })).rejects.toThrow(UnauthorizedException);
    });
  });
});