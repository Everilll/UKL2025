import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DosenModule } from './dosen/dosen.module';
import { PrismaModule } from './prisma/prisma.module';
import { BcryptModule } from './bcrypt/bcrypt.module';
import { AuthModule } from './auth/auth.module';
import { MatakuliahModule } from './matakuliah/matakuliah.module';
import { AdminModule } from './admin/admin.module';
import { MahasiswaModule } from './mahasiswa/mahasiswa.module';
import { PenjadwalanModule } from './penjadwalan/penjadwalan.module';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [DosenModule, PrismaModule, BcryptModule, AuthModule, MatakuliahModule, AdminModule, MahasiswaModule, PenjadwalanModule, AnalysisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
