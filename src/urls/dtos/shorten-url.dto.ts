import { IsString } from "class-validator";

export class ShortenUrlDTO{
    @IsString()
    url: string
}