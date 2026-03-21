import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import * as Express from 'express';
import { OtpDTO, RegisterDTO } from './dto/register-dto';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from 'src/common/decorators/user.decorators';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { ResendOtpDTO } from './dto/resend-otp.dto';
import { ConfigService } from '@nestjs/config';
//const isProduction = process.env.NODE_ENV === 'production';
//const port = process.env.PORT


@Controller('auth')
export class AuthController {

    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService
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
        const token = result.access_token
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        console.log("is production : ", isProduction)
        response.cookie('access_token', token, {
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
        const isProduction = this.configService.get('NODE_ENV') === 'production';
        response.cookie('access_token', '', {
            httpOnly: true,
            secure: isProduction,
            sameSite:isProduction ? "none" : 'lax',
            expires: new Date(0), 
        });

        return { message: 'Logged out successfully' };
    }

}
