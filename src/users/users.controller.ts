import { Controller, Get, Patch, Body, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req: any) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req: any, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(req.user.userId, dto);
  }

  @Delete('profile')
  @UseGuards(AuthGuard('jwt'))
  async deactivate(@Req() req: any) {
    return this.usersService.deactivateAccount(req.user.userId);
  }
}
