import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}

  async create(createAdminDto: CreateAdminDto) {
    try {
      const {
        username,
        password,
      } = createAdminDto;

      const checkExistingUsername = await this.prisma.user.findUnique({
        where: { username },
      })

      if (checkExistingUsername) {
        return {
          success: false,
          message: `Username ${username} already registered`,
          data: null,
        }
      }

      const hashedPassword = await this.bcrypt.hashPassword(password);

      const createAdmin = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: 'ADMIN',
        },
      })

      return {
        success: true,
        message: `Admin created successfully`,
        data: createAdmin,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async findAll() {
    try {
      const admins = await this.prisma.user.findMany({
        where: { role: 'ADMIN' },
      })

      return {
        success: true,
        message: `Admins retrieved successfully`,
        data: admins,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async findOne(id: number) {
    try {
      const admin = await this.prisma.user.findUnique({
        where: { id },
      })

      if (!admin) {
        return {
          success: false,
          message: `Admin with ID ${id} not found`,
          data: null,
        }
      }

      

      return {
        success: true,
        message: `Admin found`,
        data: admin,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async findAllUser() {
    try {
      const users = await this.prisma.user.findMany()

      return {
        success: true,
        message: `Users retrieved successfully`,
        data: users,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async update(id: number, updateAdminDto: UpdateAdminDto) {
    try {
      const {
        username,
        password,
      } = updateAdminDto;

      const existingAdmin = await this.prisma.user.findUnique({
        where: { id },
      })

      if (!existingAdmin) {
        return {
          success: false,
          message: `Admin with ID ${id} not found`,
          data: null,
        }
      }

      const updateAdmin = await this.prisma.user.update({
        where: { id },
        data: {
          username: username ?? existingAdmin.username,
          password: password ? await this.bcrypt.hashPassword(password): existingAdmin.password,
        },
      })

      return {
        success: true,
        message: `Admin updated successfully`,
        data: updateAdmin,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async remove(id: number) {
    try {
      const deleteAdmin = await this.prisma.user.delete({
        where: { id },
      })

      return {
        success: true,
        message: `Admin deleted successfully`,
        data: deleteAdmin,
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
