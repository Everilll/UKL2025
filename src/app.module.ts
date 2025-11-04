import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
