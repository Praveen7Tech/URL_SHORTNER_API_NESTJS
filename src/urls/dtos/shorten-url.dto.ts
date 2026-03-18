import { IsString } from "class-validator";

export class ShortenUrlDTO{
    @IsString()
    userId: string

    @IsString()
    url: string
}