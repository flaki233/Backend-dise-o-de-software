import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module'; // 👈 nuevo módulo
import { TradesModule } from './trades/trades.module';



@Module({
  imports: [AuthModule, PrismaModule, UsersModule,TradesModule],
})
export class AppModule {}
