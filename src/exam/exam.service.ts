import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Exam, ExamDocument } from './schemas/exam.schema';
import { Result, ResultDocument } from './schemas/result.schema';
import { CreateExamDto } from './dto/create-exam.dto';
import { SubmitExamDto } from './dto/submit-exam.dto';

@Injectable()
export class ExamService {
  constructor(
    @InjectModel(Exam.name) private examModel: Model<ExamDocument>,
    @InjectModel(Result.name) private resultModel: Model<ResultDocument>,
  ) {}

  // 1. CREATE EXAM (Teacher)
  async create(dto: CreateExamDto) {
    return this.examModel.create(dto);
  }

  // 2. GET EXAM FOR STUDENT (Hide Answers!)
  async getExamForStudent(examId: string) {
    // We strictly EXCLUDE 'questions.correctIndex' so students can't inspect element to cheat
    const exam = await this.examModel.findById(examId).select('-questions.correctIndex');
    if (!exam) throw new NotFoundException('Exam not found');
    return exam;
  }

  // 3. SUBMIT & AUTO-MARK (The Core Logic)
  async submitExam(studentId: string, examId: string, dto: SubmitExamDto) {
    // A. Check if already submitted
    const existing = await this.resultModel.findOne({ examId, studentId });
    if (existing) throw new BadRequestException('You have already submitted this exam');

    // B. Fetch the FULL exam (including correct answers)
    // We need the '+questions.correctIndex' because it is usually hidden by default in our schema
    const exam = await this.examModel.findById(examId).select('+questions.correctIndex');
    if (!exam) throw new NotFoundException('Exam not found');

    let totalScore = 0;
    let maxMarks = 0;

    // C. Grading Loop
    exam.questions.forEach((question) => {
      maxMarks += question.marks;

      // Find the student's answer for this question
      const studentAnswer = dto.answers.find((a) => a.qId === question._id.toString());

      if (studentAnswer && studentAnswer.selectedOption === question.correctIndex) {
        totalScore += question.marks;
      }
    });

    // D. Save Result
    const result = await this.resultModel.create({
      examId,
      studentId,
      score: totalScore,
      totalMarks: maxMarks,
      answers: dto.answers,
    });

    return {
      message: 'Exam submitted successfully',
      yourScore: totalScore,
      totalMarks: maxMarks,
      percentage: ((totalScore / maxMarks) * 100).toFixed(1) + '%'
    };
  }
}