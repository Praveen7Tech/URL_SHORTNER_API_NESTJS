import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ){}

    async sendOtpMail(email: string, otp: string){
        await this.mailerService.sendMail({
            to: email,
            subject: "OTP Verification.",
            template: './otp',
            context: {
                otp,
                year: new Date().getFullYear()
            }
        })
    }
}
