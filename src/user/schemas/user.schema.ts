import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true, index: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ['TEACHER', 'STUDENT'] })
  role: string;

  @Prop({ type: [String], default: [] })
  enrolledBatches: string[];

  @Prop({ type: Object, default: {} })
  branding: {
    instituteName?: string;
    logoUrl?: string;
  };
}

export const UserSchema = SchemaFactory.createForClass(User);