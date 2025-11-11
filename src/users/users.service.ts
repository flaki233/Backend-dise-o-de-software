import { Injectable, NotFoundException } from '@nestjs/common';
import { RobleRepository } from '../roble/roble.repository';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    private robleRepo: RobleRepository,
  ) {}

  // 🔹 Obtener perfil de usuario
  async getProfile(userId: any) {
    const userIdStr = typeof userId === 'number' ? String(userId) : userId;
    const user = await this.robleRepo.findUserById(userIdStr);

    if (!user) throw new NotFoundException('Usuario no encontrado');
    
    const userData = user as any;
    return {
      id: userData.userId || userData._id,
      email: userData.email,
      name: userData.name,
      location: userData.location,
      bio: userData.bio,
      reputationScore: userData.reputationScore || 0,
      tradesClosed: userData.tradesClosed || 0,
      active: userData.active,
    };
  }

  // 🔹 Actualizar perfil
  async updateProfile(userId: any, dto: UpdateUserDto) {
    const userIdStr = typeof userId === 'number' ? String(userId) : userId;
    const user = await this.robleRepo.findUserById(userIdStr);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updated = await this.robleRepo.updateUser(userIdStr, {
      name: dto.name,
      location: dto.location,
      bio: dto.bio,
    });

    const updatedData = updated as any;
    return {
      message: 'Perfil actualizado correctamente',
      user: {
        id: updatedData.userId || updatedData._id,
        email: updatedData.email,
        name: updatedData.name,
        location: updatedData.location,
        bio: updatedData.bio,
      },
    };
  }

  // 🔹 Desactivar cuenta
  async deactivateAccount(userId: any) {
    const userIdStr = typeof userId === 'number' ? String(userId) : userId;
    const user = await this.robleRepo.findUserById(userIdStr);
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.robleRepo.updateUser(userIdStr, { active: false });

    return { message: 'Cuenta desactivada correctamente' };
  }
}
