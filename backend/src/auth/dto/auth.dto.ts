import { IsString, MinLength, Matches } from 'class-validator';

export class AuthCredentialsDto {
    username: string;
    password: string;
}

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    @MinLength(8, { message: 'A senha deve ter pelo menos 8 caracteres' })
    @Matches(/(?=.*[A-Z])/, {
        message: 'A senha deve conter pelo menos uma letra maiúscula',
    })
    @Matches(/(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
        message: 'A senha deve conter pelo menos um símbolo especial',
    })
    @Matches(/(?=.*\d)/, {
        message: 'A senha deve conter pelo menos um número',
    })
    password: string;
}

