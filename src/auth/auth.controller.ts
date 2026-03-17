import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import * as Express from 'express';
import { RegisterDTO } from '../dto/register-dto';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    @HttpCode(HttpStatus.CREATED)
    async register(@Body() registerDto: RegisterDTO){
        return this.authService.register(registerDto)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: RegisterDTO, @Res({passthrough: true}) response: Express.Response){
        const result = await this.authService.login(loginDto)

        response.cookie('access_token', result.access_token, {
            httpOnly: true,       
            secure: false,       
            sameSite: 'lax',      
            maxAge: 24 * 60 * 60 * 1000, 
        });

        return {
            user:result.user,
            message: "Authentification Completed."
        }
    }
}
