import { Module } from '@nestjs/common';
import { TradesController } from './trades.controller';
import { TradesService } from './trades.service';
import { RobleModule } from '../roble/roble.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [RobleModule, AuthModule],
  controllers: [TradesController],
  providers: [TradesService],
  exports: [TradesService],
})
export class TradesModule {}
