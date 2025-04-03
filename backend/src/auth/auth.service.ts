import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/users.entity';
import { AuthCredentialsDto, CreateUserDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) { }

    async signUp(createUserDto: CreateUserDto): Promise<void> {
        console.log('teste2222')

        const { username, password } = createUserDto;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.userRepository.create({ username, password: hashedPassword });
        await this.userRepository.save(user);
    }

    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ accessToken: string, userId: number }> {
        const { username, password } = authCredentialsDto;
        const user = await this.userRepository.findOne({ where: { username } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { id: user.id, username: user.username };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken, userId: user.id };
    }
}