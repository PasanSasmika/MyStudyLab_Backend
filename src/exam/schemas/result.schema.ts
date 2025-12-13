import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema({ timestamps: true })
export class Result {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Exam', required: true })
  examId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  studentId: string;

  @Prop({ required: true })
  score: number; // e.g. 85

  @Prop({ required: true })
  totalMarks: number; // e.g. 100

  // Optional: Store exactly what they answered for review later
  @Prop({ type: [{ qId: String, selectedOption: Number }] })
  answers: { qId: string; selectedOption: number }[];
}

export const ResultSchema = SchemaFactory.createForClass(Result);