import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ShortenUrlDTO } from './dtos/shorten-url.dto';
import { GetUser } from 'src/common/decorators/user.decorators';
import { ConfigService } from '@nestjs/config';

@Controller('urls')
export class UrlsController {

    constructor(
        private readonly urlService: UrlsService,
        private readonly configService: ConfigService
    ){}

    @UseGuards(JwtAuthGuard)
    @Post('shorten')
    @HttpCode(HttpStatus.CREATED)
    async shorten(@Body() shortenUrlDto: ShortenUrlDTO, @GetUser('userId') userId: string){
        return await this.urlService.shortenUrl(shortenUrlDto.url, userId)
    }

    @UseGuards(JwtAuthGuard)
    @Get('history')
    @HttpCode(HttpStatus.OK)
    async history(
        @Query('page') page: number = 1, 
        @Query('limit') limit: number = 10, 
        @GetUser('userId') userId: string
    ) {
        return await this.urlService.history(Number(page), Number(limit), userId);
    }

    @Get(':shortCode')
    @Redirect('https://nestjs.com', 302)
    async redirectToOriginal(@Param('shortCode') shortCode: string){
        const result = await this.urlService.findByCode(shortCode)
        const clientUrl = this.configService.get('NODE_ENV') === 'production' 
        ? this.configService.get('CLIENT_URL_PRODUCTION') 
        : this.configService.get('CLIENT_URL_DEV');

        if (result.expired) {
            return { url: `${clientUrl}/usage-limit` };
        }

        return { url: result.url };
    }

}
