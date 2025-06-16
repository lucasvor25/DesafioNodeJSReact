import { Controller, Post, Body, ValidationPipe, Get, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto, CreateUserDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(
        @Body(ValidationPipe)
        createUserDto: CreateUserDto,
    ): Promise<void> {
        return this.authService.signUp(createUserDto);
    }

    @Post('/signin')
    signIn(
        @Body(ValidationPipe)
        authCredentialsDto: AuthCredentialsDto,
    ): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Get('/isLogged')
    isLogged(@Req() req: Request): { isAuthenticated: boolean; user?: any } {
        const authHeader = req.headers['authorization'] as string;

        const token = authHeader?.split(' ')[1];
        if (!token) {
            return { isAuthenticated: false };
        }

        try {
            const user = this.authService.verifyToken(token);
            return { isAuthenticated: true, user };
        } catch (error) {
            return { isAuthenticated: false };
        }
    }

    @Post('/logout')
    logout(): { message: string } {
        return { message: 'Logout realizado com sucesso' };
    }

    @Get('/healthz')
    health(): string {
        return 'OK';
    }
}