import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Existing find helper
  async findOne(email: string) {
    return this.userModel.findOne({ email });
  }

  //  1. UPDATE USER
  async updateUser(userId: string, dto: UpdateUserDto) {
    const updates: any = { ...dto };

    // If password is being changed, hash it first
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      updates.passwordHash = await bcrypt.hash(dto.password, salt);
      delete updates.password; // Remove raw password from object
    }

    const updatedUser = await this.userModel
      .findByIdAndUpdate(userId, updates, { new: true }) // new: true returns the updated doc
      .select('-passwordHash'); // Don't send the password back

    if (!updatedUser) throw new NotFoundException('User not found');
    return updatedUser;
  }

  // ✅ 2. DELETE USER
  async deleteUser(userId: string) {
    const deleted = await this.userModel.findByIdAndDelete(userId);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'User account deleted successfully' };
  }
}