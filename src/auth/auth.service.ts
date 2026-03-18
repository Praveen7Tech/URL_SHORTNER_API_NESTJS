import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RegisterDTO } from '../dto/register-dto';
import { Model } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService
    ){}

    async register(dto: RegisterDTO){
        const {name,email, password} = dto;

        const existingUser = await this.userModel.findOne({email})
        if(existingUser){
            throw new ConflictException("User with this Email already exist!")
        }

        const user = new this.userModel({name,email, password})
        await user.save()

        return { message : "User Registration completed."}
    }

    async login(dto: RegisterDTO){
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
