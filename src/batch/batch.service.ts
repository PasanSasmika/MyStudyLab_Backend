import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Batch, BatchDocument } from './schemas/batch.schema';
import { User, UserDocument } from '../user/schemas/user.schema';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchService {
  constructor(
    @InjectModel(Batch.name) private batchModel: Model<BatchDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  // ✅ 1. CREATE BATCH (Teacher)
  async createBatch(teacherId: string, dto: CreateBatchDto) {
    // Generate a simple unique code (e.g., "PHY-1234")
    // In a huge app we are use 'nanoid', but this is fine for MVP
    const uniqueCode = dto.name.substring(0, 3).toUpperCase() + '-' + Math.floor(1000 + Math.random() * 9000);

    const newBatch = await this.batchModel.create({
      ...dto,
      code: uniqueCode,
      teacherId,
    });

    return newBatch;
  }

  // ✅ 2. JOIN BATCH (Student)
  async joinBatch(studentId: string, code: string) {
    // A. Find the batch
    const batch = await this.batchModel.findOne({ code });
    if (!batch) throw new NotFoundException('Invalid Batch Code');

    // B. Check if already joined
    if (batch.students.includes(studentId)) {
      throw new BadRequestException('You are already in this batch');
    }

    // C. Perform Updates (Atomic Operations)
    // 1. Add Student ID to Batch
    batch.students.push(studentId);
    await batch.save();

    // 2. Add Batch ID to Student Profile (For fast lookup later)
    await this.userModel.findByIdAndUpdate(studentId, {
      $addToSet: { enrolledBatches: batch._id.toString() }, // $addToSet prevents duplicates
    });

    return { message: `Successfully joined ${batch.name}`, batchId: batch._id };
  }

  // ✅ 3. LIST BATCHES (Dynamic)
  async getBatches(userId: string, role: string) {
    if (role === 'TEACHER') {
      // If Teacher: Show batches I created
      return this.batchModel.find({ teacherId: userId }).sort({ createdAt: -1 });
    } else {
      // If Student: Show batches I am in
      return this.batchModel.find({ students: userId })
        .populate('teacherId', 'name') // Show teacher's name, not just ID
        .sort({ createdAt: -1 });
    }
  }
}