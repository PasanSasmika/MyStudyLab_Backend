import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BatchService } from './batch.service';
import { Batch, BatchSchema } from './schemas/batch.schema';
import { User, UserSchema } from '../user/schemas/user.schema'; 
import { BatchController } from './batch.controller';

@Module({
  imports: [
   MongooseModule.forFeature([
      { name: Batch.name, schema: BatchSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [BatchController],
  providers: [BatchService],
  exports: [BatchService], // Export if Exams need to check batches later
})
export class BatchModule {}