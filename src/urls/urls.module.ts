import { Module } from '@nestjs/common';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './schemas/urls.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Url.name, schema: UrlSchema}])
  ],
  controllers: [UrlsController],
  providers: [UrlsService]
})
export class UrlsModule {}
