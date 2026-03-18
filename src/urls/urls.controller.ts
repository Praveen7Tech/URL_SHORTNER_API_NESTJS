import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortenUrlDTO } from './dtos/shorten-url.dto';
import * as Express from 'express';
import { AuthRequest } from 'src/auth/interfaces/auth.interface'; 

@Controller('urls')
export class UrlsController {

    constructor(
        private readonly urlService: UrlsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    @HttpCode(HttpStatus.CREATED)
    async shorten(@Body() shortenUrlDto: ShortenUrlDTO, @Req() req: Express.Request){
        const authReq = req as AuthRequest;
        const userId = authReq.user.userId;
        return await this.urlService.shortenUrl(shortenUrlDto.url, userId)
    }

    @Get(':shortCode')
    async redirectToOriginal(@Param('shortCode') shortCode: string, @Res() res: Express.Response){
        const originalUrl = await this.urlService.findByCode(shortCode)
        res.redirect(originalUrl)
    }
}
