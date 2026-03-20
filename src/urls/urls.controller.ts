import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortenUrlDTO } from './dtos/shorten-url.dto';
import { GetUser } from 'src/common/decorators/user.decorators';

@Controller('urls')
export class UrlsController {

    constructor(
        private readonly urlService: UrlsService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    @HttpCode(HttpStatus.CREATED)
    async shorten(@Body() shortenUrlDto: ShortenUrlDTO, @GetUser('userId') userId: string){
        return await this.urlService.shortenUrl(shortenUrlDto.url, userId)
    }

    @Get(':shortCode')
    @Redirect('https://nestjs.com', 302)
    async redirectToOriginal(@Param('shortCode') shortCode: string){
        const originalUrl = await this.urlService.findByCode(shortCode)
        return {url: originalUrl}
    }
}
