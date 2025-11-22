import { Module } from '@nestjs/common';
import { MatchAuditService } from './match-audit.service';
import { MatchAuditController } from './match-audit.controller';
import { RobleModule } from '../roble/roble.module';

@Module({
  imports: [RobleModule],              
  controllers: [MatchAuditController],
  providers: [MatchAuditService],      
  exports: [MatchAuditService],        
})
export class MatchAuditModule {}
