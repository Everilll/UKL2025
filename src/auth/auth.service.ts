import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService
    ) {}

    async LoginUser(username: string, password: string) {
        try {
            const findUsername = await this.prisma.user.findUnique({
                where: { username }
            })

            if (!findUsername) {
                return {
                    success: false,
                    message: 'Username tidak ditemukan',
                    data: null
                }
            }

            const IsPasswordValid = findUsername.password === password

            if (!IsPasswordValid) {
                return {
                    success: false,
                    message: 'Password salah',
                    data: null
                }
            }

            const payload = {
                id: findUsername.id,
                name: findUsername.name,
                username: findUsername.username,
                role: findUsername.role
            }

            return {
                status: 'success',
                message: 'Login berhasil',
                token: this.jwtService.sign(payload)
            }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
}
