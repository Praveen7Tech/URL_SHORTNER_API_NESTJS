import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Verification extends Document {
  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  otp: string;

  @Prop({ required: true })
  payload: string; 

  @Prop({ required: true, expires: 0 }) // TTL Index
  expiresAt: Date;

  createdAt: Date;
  updatedAt: Date;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
