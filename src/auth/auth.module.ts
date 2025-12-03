import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtStrategy } from 'src/helper/jwt-strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [AuthService, BcryptService, JwtStrategy],
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.secret_key,
      signOptions: { expiresIn: '1d' }
    })
  ]
})
export class AuthModule {}
