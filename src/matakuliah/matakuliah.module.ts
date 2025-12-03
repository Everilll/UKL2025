import { Module } from '@nestjs/common';
import { MatakuliahService } from './matakuliah.service';
import { MatakuliahController } from './matakuliah.controller';

@Module({
  controllers: [MatakuliahController],
  providers: [MatakuliahService],
})
export class MatakuliahModule {}
