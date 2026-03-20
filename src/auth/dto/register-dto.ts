import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class RegisterDTO{
    @MinLength(2)
    name: string;

    @IsEmail()
    email: string

    @MinLength(6)
    password: string
}

export class OtpDTO{
    @IsEmail()
    @IsNotEmpty()
    email: string

    @MinLength(5)
    otp: string
}