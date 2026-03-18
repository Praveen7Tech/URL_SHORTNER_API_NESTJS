import { Request } from "express";

export interface ActiveUser{
  userId: string;
  email: string
}

export interface AuthRequest extends Request{
  user: ActiveUser
}