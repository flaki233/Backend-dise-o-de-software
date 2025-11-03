import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dtos/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  // 🔹 Obtener perfil de usuario
  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        bio: true,
        reputationScore: true,
        tradesClosed: true,
        active: true,
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  // 🔹 Actualizar perfil
  async updateProfile(userId: number, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        location: dto.location,
        bio: dto.bio,
      },
      select: {
        id: true,
        email: true,
        name: true,
        location: true,
        bio: true,
      },
    });

    return { message: 'Perfil actualizado correctamente', user: updated };
  }

  // 🔹 Desactivar cuenta
  async deactivateAccount(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.prisma.user.update({
      where: { id: userId },
      data: { active: false },
    });

    return { message: 'Cuenta desactivada correctamente' };
  }
}
