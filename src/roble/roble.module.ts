import { Module } from '@nestjs/common';
import { RobleService } from './roble.service';
import { RobleRepository } from './roble.repository';

@Module({
  providers: [RobleService, RobleRepository],
  exports: [RobleService, RobleRepository],
})
export class RobleModule {}

