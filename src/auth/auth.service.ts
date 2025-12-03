import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';
import { identity } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
    private readonly jwt: JwtService,
  ) { }

  async login(authDto: AuthDto) {
    try {
      const { username, password } = authDto;

      const existingUsername = await this.prisma.user.findUnique({
        where: { username },
      });

      if (!existingUsername) {
        return {
          success: false,
          message: `Username ${username} not found`,
          data: null,
        };
      }

      const isPasswordValid = await this.bcrypt.comparePassword(
        password,
        existingUsername.password,
      );

      if (!isPasswordValid) {
        return {
          success: false,
          message: `Invalid password`,
          data: null,
        }
      }

      const token = this.jwt.sign({
        id: existingUsername.id,
        username: existingUsername.username,
        role: existingUsername.role,
      })

      return {
        success: true,
        message: `Login successful`,
        data: {
          token: token,
          role: existingUsername.role,
        },
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }
}
