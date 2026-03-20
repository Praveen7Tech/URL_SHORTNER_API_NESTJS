import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ActiveUser } from "src/common/interfaces/auth.interface";


export const GetUser = createParamDecorator(
    (data: keyof ActiveUser | undefined, ctx : ExecutionContext)=>{
        const request = ctx.switchToHttp().getRequest()
        const user = request.user;

        return data ? user?.[data] : user
    }
)