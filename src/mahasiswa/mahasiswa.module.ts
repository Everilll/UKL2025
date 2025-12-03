import { Module } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { MahasiswaController } from './mahasiswa.controller';
import { PengambilanService } from './pengambilan.service';

@Module({
  controllers: [MahasiswaController],
  providers: [MahasiswaService, PengambilanService],
})
export class MahasiswaModule {}
