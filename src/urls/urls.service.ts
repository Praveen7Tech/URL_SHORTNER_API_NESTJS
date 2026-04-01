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

        if(UrlData.clicks >= 2){
            return {expired: true}
        }

        UrlData.clicks += 1;
        await UrlData.save()

        return {
            url: UrlData.originalUrl,
            expired : false
        }
    }

    async history(page: number = 1, limit: number = 10, userId: string) {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.urlModel
                .find({ userId })
                .select('originalUrl shortCode clicks createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            this.urlModel.countDocuments({ userId }),
        ]);

        const history = data.map((url) => ({
            id: url._id.toString(), 
            originalUrl: url.originalUrl,
            shortUrl: `${process.env.BASE_URL}/urls/${url.shortCode}`,
            clicks: url.clicks,
            createdAt: url.createdAt,
        }));

        return {
            history,
            totalPages: Math.ceil(total / limit),
        };
    }

}
