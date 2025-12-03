import { Injectable } from '@nestjs/common';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class MahasiswaService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) {}
  async create(createMahasiswaDto: CreateMahasiswaDto, user: any) {
    try {
      const {
        nim,
        username,
        password,
        nama_mahasiswa,
        jenis_kelamin,
        jurusan,
      } = createMahasiswaDto

      if (user.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admin can create mahasiswa',
          data: null,
        }
      }

      const existingnim = await this.prisma.mahasiswa.findUnique({
        where: { nim },
      })

      if (existingnim) {
        return {
          success: false,
          message: `NIM already registered`,
          data: null,
        }
      }

      const createUser = await this.prisma.user.create({
        data: {
          username,
          password: await this.bcrypt.hashPassword(password),
          role: 'MAHASISWA',
        },
      })
      const createMahasiswa = await this.prisma.mahasiswa.create({
        data: {
          nim,
          nama_mahasiswa,
          jenis_kelamin,
          jurusan,
          role: 'MAHASISWA',
          user_id: createUser.id,
        },
      })

      return {
        success: true,
        message: 'Mahasiswa created successfully',
        data: {
          nim: createMahasiswa.nim,
          nama_mahasiswa: createMahasiswa.nama_mahasiswa,
          jenis_kelamin: createMahasiswa.jenis_kelamin,
          jurusan: createMahasiswa.jurusan,
        }
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
      const mahasiswa = await this.prisma.mahasiswa.findMany({
        select: {
          nim: true,
          nama_mahasiswa: true,
          jenis_kelamin: true,
          jurusan: true,
        }
      })

      return {
        success: true,
        message: `Mahasiswa retrieved successfully`,
        data: mahasiswa,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async update(id: string, updateMahasiswaDto: UpdateMahasiswaDto) {
    try {
      const {
        nim,
        username,
        password,
        nama_mahasiswa,
        jenis_kelamin,
        jurusan,
      } = updateMahasiswaDto;

      const findMahasiswa = await this.prisma.mahasiswa.findUnique({
        where: { nim: id },
      })

      if (!findMahasiswa) {
        return {
          success: false,
          message: `Mahasiswa with NIM ${id} not found`,
          data: null,
        }
      }

      const findUser = await this.prisma.user.findUnique({
        where: { id: findMahasiswa.user_id },
      })

      if (!findUser) {
        return {
          success: false,
          message: `User not found for Mahasiswa with NIM ${id}`,
          data: null,
        }
      }

      const updateMahasiswa = await this.prisma.mahasiswa.update({
        where: { nim: id },
        data: {
          nim: nim ?? findMahasiswa.nim,
          nama_mahasiswa: nama_mahasiswa ?? findMahasiswa.nama_mahasiswa,
          jenis_kelamin: jenis_kelamin ?? findMahasiswa.jenis_kelamin,
          jurusan: jurusan ?? findMahasiswa.jurusan,
        },
      })

      const updateUser = await this.prisma.user.update({
        where: { id: findMahasiswa.user_id },
        data: {
          username: username ?? findUser.username,
          password: password ? await this.bcrypt.hashPassword(password) : findUser.password,
        },
      })

      return {
        success: true,
        message: 'Mahasiswa updated successfully',
        data: {
          nim: updateMahasiswa.nim,
          nama_mahasiswa: updateMahasiswa.nama_mahasiswa,
          jenis_kelamin: updateMahasiswa.jenis_kelamin,
          jurusan: updateMahasiswa.jurusan,
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

  async remove(id: string) {
    try {
      const findMahasiswa = await this.prisma.mahasiswa.findUnique({
        where: { nim: id },
      })

      if (!findMahasiswa) {
        return {
          success: false,
          message: `Mahasiswa with NIM ${id} not found`,
          data: null,
        }
      }

      const deleteMahasiswa = await this.prisma.mahasiswa.delete({
        where: { nim: id },
      })

      const deleteUser = await this.prisma.user.delete({
        where: { id: findMahasiswa.user_id },
      })

      return {
        success: true,
        message: 'Mahasiswa deleted successfully',
        data: {
          nim: deleteMahasiswa.nim,
          nama_mahasiswa: deleteMahasiswa.nama_mahasiswa,
          jenis_kelamin: deleteMahasiswa.jenis_kelamin,
          jurusan: deleteMahasiswa.jurusan,
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
