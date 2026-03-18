import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortenUrlDTO } from './dtos/shorten-url.dto';
import * as Express from 'express';

@Controller('urls')
export class UrlsController {

    constructor(
        private readonly urlService: UrlsService
    ){}

    //@UseGuards(JwtAuthGuard)
    @Post('shorten')
    @HttpCode(HttpStatus.CREATED)
    shorten(@Body() shortenUrlDto: ShortenUrlDTO){
        return this.urlService.shortenUrl(shortenUrlDto.url, shortenUrlDto.userId)
    }

    @Get(':shortCode')
    async redirectToOriginal(@Param('shortCode') shortCode: string, @Res() res: Express.Response){
        const originalUrl = await this.urlService.findByCode(shortCode)
        res.redirect(originalUrl)
    }
}
