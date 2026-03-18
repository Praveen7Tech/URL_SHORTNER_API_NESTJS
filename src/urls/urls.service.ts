import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Url } from './schemas/urls.schema';
import { Model } from 'mongoose';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlsService {

    constructor(
        @InjectModel(Url.name) private readonly urlModel: Model<Url>
    ){}

    async shortenUrl(url: string, userId: string){

        const shortCode = nanoid(6)

        const newUrl = new this.urlModel({
            originalUrl: url, 
            shortCode,
            userId
        })
        await newUrl.save()
        const urlFormat = `${process.env.BASE_URL}/urls/${newUrl.shortCode}`
        return {shortUrl:urlFormat}
    }

    async findByCode(shortCode: string){
        const UrlData = await this.urlModel.findOne({shortCode})
        if(!UrlData){
            throw new NotFoundException("Requested Url not found!")
        }
        return UrlData.originalUrl
    }
}
