import { Module } from '@nestjs/common';
import { ExplorarController } from './explorar.controller';
import { ExplorarService } from './explorar.service';
import { RobleService } from '../roble/roble.service';

@Module({
  controllers: [ExplorarController],
  providers: [ExplorarService, RobleService],
})
export class ExplorarModule {}
