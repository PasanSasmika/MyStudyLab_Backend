import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type BatchDocument = Batch & Document;

@Schema({ timestamps: true })
export class Batch {
  @Prop({ required: true })
  name: string; // e.g. "Physics 2025 Theory"

  @Prop({ required: true, unique: true, index: true })
  code: string; // e.g. "PHY-8821" (Generated automatically)

  // Link to the Teacher (The Owner)
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  teacherId: string;

  // List of Students in this batch
  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }], default: [] })
  students: string[];

  // Is the class active? (False means archived)
  @Prop({ default: true })
  isActive: boolean;
}

export const BatchSchema = SchemaFactory.createForClass(Batch);