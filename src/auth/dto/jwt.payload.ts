import { Types } from "mongoose";

export interface JwtPayload {
  sub: string | Types.ObjectId; 
  email: string;
  iat?: number;                 
  exp?: number;                 
}