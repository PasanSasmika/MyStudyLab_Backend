import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

// 1. Define what a "Question" looks like
@Schema()
export class Question {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: string; // Auto-generate ID for every question

  @Prop({ required: true })
  text: string; 

  @Prop({ type: [String], required: true })
  options: string[]; 

  @Prop({ required: true, select: false }) 
  correctIndex: number; 

  @Prop({ default: 1 })
  marks: number;
}
const QuestionSchema = SchemaFactory.createForClass(Question);


// 2. Define the "Exam" document
@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true })
  title: string; 

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Batch', required: true })
  batchId: string; 

  @Prop({ required: true })
  startTime: Date; 

  @Prop({ required: true })
  durationMinutes: number;

  @Prop({ default: 'DRAFT', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] })
  status: string;

  @Prop()
  resourcePdfUrl?: string;

  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);