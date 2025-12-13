import { Body, Controller, Delete, Patch, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  // Update My Profile
  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  async updateProfile(@Request() req, @Body() dto: UpdateUserDto) {
    // req.user is attached by the JwtStrategy we built earlier
    return this.userService.updateUser(req.user.userId, dto);
  }

  // Delete My Account
  @UseGuards(JwtAuthGuard)
  @Delete('profile')
  async deleteAccount(@Request() req) {
    return this.userService.deleteUser(req.user.userId);
  }
}