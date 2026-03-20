import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { RegisterDTO } from './dto/register-dto';
import { Model } from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDTO } from 'src/auth/dto/login.dto';
import { Verification } from './schemas/verification.schema';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        @InjectModel(Verification.name) private readonly verificationModel: Model<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
    ){}

    async register(dto: RegisterDTO){
        const {name,email, password} = dto;

        const existingUser = await this.userModel.findOne({email})
        if(existingUser){
            throw new ConflictException("User with this Email already exist!")
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(10000 + Math.random() * 90000).toString();
        
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 3);

        await this.verificationModel.findOneAndUpdate(
            {email},
            {
                otp,
                expiresAt,
                payload:JSON.stringify({name, password: hashedPassword})
            },
            {upsert: true}
        )

        await this.mailService.sendOtpMail(email, otp)

        return { message : "Check your Email for otp verification!"}
    }

     async verifyOtp(email: string, otp: string) {

        const record = await this.verificationModel.findOne({ email});
        if (!record) {
            throw new BadRequestException("This Registartion Session Expired!");
        }

        const now = new Date()
         const otpGeneratedAt = new Date(record.updatedAt); 
        const diffInSeconds = (now.getTime() - otpGeneratedAt.getTime()) / 1000;

        if (diffInSeconds > 60) { 
            throw new BadRequestException("OTP has expired.");
        }

        if(otp !== record.otp){
            throw new BadRequestException("Invalid OTP");
        }

        const { name, password } = JSON.parse(record.payload);

        const newUser = new this.userModel({ name, email, password });
        await newUser.save();

        await this.verificationModel.deleteOne({ _id: record._id });

        return { message: "Registartion Completed successfully!" };
    }


    async resendOtp(email: string) {
        const newOtp = Math.floor(10000 + Math.random() * 90000).toString();
        
        //  Calculate a new 3-minute expiry from now
        const newExpiry = new Date();
        newExpiry.setMinutes(newExpiry.getMinutes() + 3);

        const updatedRecord = await this.verificationModel.findOneAndUpdate(
            { email }, 
            { 
                otp: newOtp, 
                expiresAt: newExpiry 
            },
            { new: true } 
        );

        if (!updatedRecord) {
            throw new NotFoundException("Registration session expired. Please register again.");
        }

        await this.mailService.sendOtpMail(email, newOtp)

        return { 
            message: "A new OTP has been sent to your Email."
        };
    }


    async login(dto: LoginDTO){
        const {email, password} = dto;

        const user = await this.userModel.findOne({email})
        if(!user){
            throw new NotFoundException("User Not found.")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if(!isPasswordMatch){
            throw new BadRequestException("Invalid Credentials")
        }

        const payload = {sub: user._id, email: user.email}
        const token = this.jwtService.sign(payload)
        return { 
            access_token:token,
            user: { email: user.email, id: user._id }
        }
    }

    async healthCheck(userId: string){
        const user = await this.userModel.findById(userId)
        if(!user){
            throw new NotFoundException("uSER NOT FOUND")
        }
        return {
            userId: user._id.toString(),
            name: user.name,
            email:user.email
        }
    }
}
