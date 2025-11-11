import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TradesModule } from './trades/trades.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { RobleModule } from './roble/roble.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    TradesModule,
    OfertasModule,
    CategoriasModule,
    RobleModule,
  ],
})
export class AppModule {}
