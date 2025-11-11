import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { TradesModule } from './trades/trades.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { CategoriasModule } from './categorias/categorias.module';

@Module({
  imports: [
    AuthModule, 
    PrismaModule, 
    UsersModule,
    TradesModule,
    OfertasModule,
    CategoriasModule,
  ],
})
export class AppModule {}
