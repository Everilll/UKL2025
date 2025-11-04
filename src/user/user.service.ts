import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async CreateUser(createUserDto: CreateUserDto) {
            try {
                const {
                    name,
                    username,
                    password,
                    role
                } = createUserDto
    
                const findUsername = await this.prisma.user.findUnique({
                    where: { username }
                })
    
                if (findUsername) {
                    return {
                        success: false,
                        message: 'Username sudah digunakan',
                        data: null
                    }
                }
    
                const createUser = await this.prisma.user.create({
                    data: {
                        name,
                        username,
                        password,
                        class: createUserDto.class,
                        position: createUserDto.position,
                        role
                    }
                })
    
                return {
                    success: true,
                    message: 'User berhasil dibuat',
                    data: {
                        id: createUser.id,
                        createUser
                    }
                }
            } catch (error) {
                return new InternalServerErrorException(error)
            }
        }

    async UpdateUser(Id: number, updateUserDto: UpdateUserDto) {
        try {
            const findUser = await this.prisma.user.findUnique({
                where: {id : Id}
            })

            if (!findUser) {
                return {
                    success: false,
                    message: 'User tidak ditemukan',
                    data: null
                }
            }

            const {
                name, 
                username, 
                password, 
                role
            } = updateUserDto

            const updateUser = await this.prisma.user.update({
                where: { id: Id },
                data: {
                    name: name ?? findUser.name,
                    username: username ?? findUser.username,
                    password: password ?? findUser.password,
                    class: updateUserDto.class ?? findUser.class,
                    position: updateUserDto.position ?? findUser.position,
                    role: role ?? findUser.role
                }
            })

            return {
                success: true,
                message: 'User berhasil diupdate',
                data: {
                    id: updateUser.id,
                    name: updateUser.name,
                    username: updateUser.username,
                    role: updateUser.role
                }
            }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }

    async ShowUser(Id: number) {
        try {
            const showUser = await this.prisma.user.findUnique({
            where: { id: Id },
        })

        if(!showUser) {
            return {
                status: 'failed',
                data: null
            }
        }

        return {
            status: 'success',
            data: {
                id: showUser.id,
                name: showUser.name,
                username: showUser.username,
                role: showUser.role
            }
        }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }

    async DeleteUser (username: string, password: string) {
        const findUsername = await this.prisma.user.findUnique({
            where: { username }
        })

        if (!findUsername) {
            return {
                status: 'failed',
                message: 'Username tidak ditemukan',
                data: null
            }
        }

        const IsPasswordValid = findUsername.password === password

        if (!IsPasswordValid) {
            return {
                status: 'failed',
                message: 'Password salah',
                data: null
            }
        }

        const deleteUser = await this.prisma.user.delete({
            where: { id: findUsername.id }
        })

        return {
            status: 'success',
            message: 'User berhasil di hapus',
            data: null
        }
    }
}
