import { Module } from '@nestjs/common';
import { ExamController } from './exam.controller';
import { ExamService } from './exam.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Exam, ExamSchema } from './schemas/exam.schema';
import { BatchModule } from 'src/batch/batch.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Exam.name, schema: ExamSchema }]),
    BatchModule, 
  ],
  controllers: [ExamController],
  providers: [ExamService]
})
export class ExamModule {}
