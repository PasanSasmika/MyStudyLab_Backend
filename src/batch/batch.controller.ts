import { Body, Controller, Get, Post, Request, UseGuards, ForbiddenException } from '@nestjs/common';
import { BatchService } from './batch.service';
import { CreateBatchDto } from './dto/create-batch.dto';
import { JoinBatchDto } from './dto/join-batch.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard) // 🔒 Protects ALL routes below (Login required)
@Controller('batches')
export class BatchController {
  constructor(private readonly batchService: BatchService) {}

  // 1. CREATE BATCH (Teacher Only)
  @Post()
  create(@Request() req, @Body() dto: CreateBatchDto) {
    // Security Check: Only Teachers can create batches
    if (req.user.role !== 'TEACHER') {
      throw new ForbiddenException('Only teachers can create batches');
    }
    
    // Pass the Teacher's ID from the token
    return this.batchService.createBatch(req.user.userId, dto);
  }

  // 2. JOIN BATCH (Student Only)
  @Post('join')
  join(@Request() req, @Body() dto: JoinBatchDto) {
    // Security Check: Only Students can join batches
    if (req.user.role !== 'STUDENT') {
      throw new ForbiddenException('Teachers cannot join batches');
    }

    return this.batchService.joinBatch(req.user.userId, dto.code);
  }

  // 3. GET MY BATCHES (Both)
  @Get()
  findAll(@Request() req) {
    // Returns created batches for Teachers, or joined batches for Students
    return this.batchService.getBatches(req.user.userId, req.user.role);
  }
}