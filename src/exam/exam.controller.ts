import { Body, Controller, Get, Param, Post, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { ExamService } from './exam.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // 🔒 Login required for everything
@Controller('exams')
export class ExamController {
  constructor(private readonly examService: ExamService) {}

  // 1. CREATE EXAM (Teacher Only)
  @Post()
  create(@Request() req, @Body() dto: CreateExamDto) {
    if (req.user.role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can create exams');
    }
    return this.examService.create(dto);
  }

  // 2. GET EXAM (Student) - Starts the exam
  @Get(':id')
  findOne(@Param('id') id: string) {
    // In Phase 2, we will check if the student is actually enrolled in the batch here
    return this.examService.getExamForStudent(id);
  }

  // 3. SUBMIT EXAM (Student Only)
  @Post(':id/submit')
  submit(@Request() req, @Param('id') id: string, @Body() dto: SubmitExamDto) {
    if (req.user.role !== 'STUDENT') {
      throw new ForbiddenException('Teachers cannot submit exams');
    }
    // Pass the Student ID from the token so they can't submit for someone else
    return this.examService.submitExam(req.user.userId, id, dto);
  }
}