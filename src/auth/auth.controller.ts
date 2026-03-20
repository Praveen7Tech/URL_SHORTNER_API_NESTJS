import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import * as Express from 'express';
import { OtpDTO, RegisterDTO } from './dto/register-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorators';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { ResendOtpDTO } from './dto/resend-otp.dto';
const isProduction = process.env.NODE_ENV === 'production';


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    @HttpCode(HttpStatus.OK)
    async register(@Body() registerDto: RegisterDTO){
        return this.authService.register(registerDto)
    }

    @Post('verifyotp')
    @HttpCode(HttpStatus.CREATED)
    async verifyOtp(@Body() data: OtpDTO){
        return this.authService.verifyOtp(data.email,data.otp)
    }

    @Post('resendOtp')
    @HttpCode(HttpStatus.OK)
    async resendOtp(@Body() resendOtpDto: ResendOtpDTO){
        return this.authService.resendOtp(resendOtpDto.email)
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    async login(@Body() loginDto: LoginDTO, @Res({passthrough: true}) response : Express.Response){
        const result = await this.authService.login(loginDto)
        response.cookie('access_token', result.access_token, {
            httpOnly: true,       
            secure: isProduction,       
            sameSite: isProduction ? 'none' : 'lax',      
            maxAge: 24 * 60 * 60 * 1000, 
        });

        return {
            user:result.user,
            message: "Authentication completed."
        }
    }

    @UseGuards(JwtAuthGuard)
    @Get('health')
    healthCheck(@GetUser("userId") userId: string) {
        return this.authService.healthCheck(userId)
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) response: Express.Response) {
        response.cookie('access_token', '', {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? 'none' : 'lax',
            expires: new Date(0), 
        });

        return { message: 'Logged out successfully' };
    }

}
