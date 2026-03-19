import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import * as Express from 'express';
import { RegisterDTO } from '../dto/register-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthRequest } from './interfaces/auth.interface';


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
            secure: true,       
            sameSite: 'none',      
            maxAge: 24 * 60 * 60 * 1000, 
        });

        return {
            user:result.user,
            message: "Authentification Completed."
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('health')
    getMe(@Req() req: Express.Request) {
        const authReq = req as AuthRequest;
        const userId = authReq.user.userId;
        return this.authService.healthCheck(userId)
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Express.Response) {
        response.cookie('access_token', '', {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            expires: new Date(0), 
        });

        return { message: 'Logged out successfully' };
    }

}
