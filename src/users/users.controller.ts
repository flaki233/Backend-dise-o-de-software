import { Controller, Get, Patch, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Obtener perfil
  @Get(':id')
  async getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.getProfile(id);
  }

  // 🔹 Actualizar perfil
  @Patch(':id')
  async updateProfile(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    return this.usersService.updateProfile(id, dto);
  }

  // 🔹 Desactivar cuenta
  @Delete(':id')
  async deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deactivateAccount(id);
  }
}
