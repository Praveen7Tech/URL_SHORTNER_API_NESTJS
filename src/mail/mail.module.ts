import { Global, Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

@Global()
@Module({
  imports:[
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async(config: ConfigService)=>({
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth:{
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD')
          },
        },
        defaults:{
          from: config.get('MAIL_FROM')
        },
        template:{
          dir: join(process.cwd(), 'dist', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options:{
            strict: true,
          }
        }
      })
    })
  ],
  providers: [MailService],
  exports:[MailService]
})
export class MailModule {}
