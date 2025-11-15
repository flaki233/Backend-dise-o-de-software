import { Module } from '@nestjs/common';
import { MatchAuditService } from './match-audit.service';
import { MatchAuditController } from './match-audit.controller';
import { RobleService } from '../roble/roble.service';

@Module({
  controllers: [MatchAuditController],
  providers: [MatchAuditService, RobleService],
  exports: [MatchAuditService],
})
export class MatchAuditModule {}
