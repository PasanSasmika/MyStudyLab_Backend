import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type ExamDocument = Exam & Document;

// 1. Define what a "Question" looks like
@Schema()
export class Question {
  @Prop({ type: Types.ObjectId, default: () => new Types.ObjectId() })
  _id: string; // Auto-generate ID for every question

  @Prop({ required: true })
  text: string; // e.g. "What is Newton's Second Law?"

  @Prop({ type: [String], required: true })
  options: string[]; // ["F=ma", "E=mc^2", "v=u+at", "P=VI"]

  // ⚠️ CRITICAL: 'select: false' hides the answer when sending to students
  @Prop({ required: true, select: false }) 
  correctIndex: number; // e.g., 0 (Index of the correct option)

  @Prop({ default: 1 })
  marks: number;
}
const QuestionSchema = SchemaFactory.createForClass(Question);


// 2. Define the "Exam" document
@Schema({ timestamps: true })
export class Exam {
  @Prop({ required: true })
  title: string; // e.g. "Unit 1 MCQ"

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Batch', required: true })
  batchId: string; // Linked to the Class

  @Prop({ required: true })
  startTime: Date; // e.g. "2025-10-10T08:00:00Z"

  @Prop({ required: true })
  durationMinutes: number; // e.g. 60

  @Prop({ default: 'DRAFT', enum: ['DRAFT', 'PUBLISHED', 'ARCHIVED'] })
  status: string;

  // Embed the questions array directly here
  @Prop({ type: [QuestionSchema], default: [] })
  questions: Question[];
}

export const ExamSchema = SchemaFactory.createForClass(Exam);