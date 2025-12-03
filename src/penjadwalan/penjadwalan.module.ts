import { Module } from '@nestjs/common';
import { PenjadwalanService } from './penjadwalan.service';
import { PenjadwalanController } from './penjadwalan.controller';

@Module({
  controllers: [PenjadwalanController],
  providers: [PenjadwalanService],
})
export class PenjadwalanModule {}
