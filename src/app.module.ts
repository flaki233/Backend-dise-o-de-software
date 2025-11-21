import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TradesModule } from './trades/trades.module';
import { OfertasModule } from './ofertas/ofertas.module';
import { CategoriasModule } from './categorias/categorias.module';
import { RobleModule } from './roble/roble.module';
import { ExplorarModule } from './explorar/explorar.module';
import { PropuestasModule } from './propuestas/propuestas.module';
import { MatchAuditModule } from './match-audit/match-audit.module';
import { ConfigModule } from '@nestjs/config';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { BusquedaModule } from './busqueda/busqueda.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    AuthModule,
    UsersModule,
    TradesModule,
    BusquedaModule,
    OfertasModule,
    CategoriasModule,
    RobleModule,ExplorarModule,PropuestasModule, MatchAuditModule,SuggestionsModule
  ],
})
export class AppModule {}
