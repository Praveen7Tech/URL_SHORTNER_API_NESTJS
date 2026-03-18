import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt'){
    handleRequest(err:Error, user: any, info: Error){
        console.log("auth check", user)
        if(err || !user){
            throw err || new UnauthorizedException("Unautharised Access!")
        }
        return user
    }  
}