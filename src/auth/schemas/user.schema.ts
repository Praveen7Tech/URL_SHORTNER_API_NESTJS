import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import * as bcrypt from 'bcrypt';


@Schema()
export class User extends Document{
    @Prop({required: true})
    name: string;

    @Prop({unique: true, required: true})
    email: string;

    @Prop({required: true})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)

// UserSchema.pre('save', async function () {
//   if (!this.isModified('password')) return;

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });