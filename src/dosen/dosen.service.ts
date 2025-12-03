import { Injectable } from '@nestjs/common';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';
import { QueryDosenDto } from './dto/query-dosen.dto';

@Injectable()
export class DosenService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) { }

  async create(createDosenDto: CreateDosenDto) {
    try {
      const {
        nidn,
        username,
        password,
        nama_dosen,
        jenis_kelamin,
        alamat,
      } = createDosenDto;

      const findnidn = await this.prisma.dosen.findUnique({
        where: { nidn },
      })

      if (findnidn) {
        return {
          success: false,
          message: `NIDN ${nidn} already registered`,
          data: null,
        }
      }

      const findUsername = await this.prisma.user.findUnique({
        where: { username },
      })

      if (findUsername) {
        return {
          success: false,
          message: `Username ${username} already registered`,
          data: null,
        }
      }

      const hashedPassword = await this.bcrypt.hashPassword(password);

      const createUser = await this.prisma.user.create({
        data: {
          username,
          password: hashedPassword,
          role: 'DOSEN',
        },
      })

      const createDosen = await this.prisma.dosen.create({
        data: {
          nidn,
          nama_dosen,
          jenis_kelamin,
          alamat,
          user_id: createUser.id,
        },
      })

      return {
        success: true,
        message: 'Dosen created successfully',
        data: {
          nidn: createDosen.nidn,
          nama_dosen: createDosen.nama_dosen,
          jenis_kelamin: createDosen.jenis_kelamin,
          alamat: createDosen.alamat,
        },
      }

    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      }
    }
  }

  async findAll() {
    try {
      const dosens = await this.prisma.dosen.findMany({
        select: {
          nidn: true,
          nama_dosen: true,
          jenis_kelamin: true,
          alamat: true,}
      })

      return {
        success: true,
        message: 'Dosen retrieved successfully',
        data: dosens
      }

    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      }
    }
  }

  async update(id: number, updateDosenDto: UpdateDosenDto) {
    try {
      const {
        nidn,
        username,
        password,
        nama_dosen,
        jenis_kelamin,
        alamat,
      } = updateDosenDto

      const findDosen = await this.prisma.dosen.findUnique({
        where: { nidn: id },
      })

      if (!findDosen) {
        return {
          success: false,
          message: `Dosen with NIDN ${nidn} not found`,
          data: null,
        }
      }

      const findUser = await this.prisma.user.findUnique({
        where: { id: findDosen.user_id },
      })

      if (!findUser) {
        return {
          success: false,
          message: `User with ID ${findDosen.user_id} not found`,
          data: null,
        }
      }
      const updateDosen = await this.prisma.dosen.update({
        where: { nidn: id },
        data: {
          nidn: nidn ?? findDosen.nidn,
          nama_dosen: nama_dosen ?? findDosen.nama_dosen,
          jenis_kelamin: jenis_kelamin ?? findDosen.jenis_kelamin,
          alamat: alamat ?? findDosen.alamat,
        },
      })
      
      const updateUser = await this.prisma.user.update({
        where: { id: findDosen.user_id },
        data: {
          username: username ?? findUser.username,
          password: password ? await this.bcrypt.hashPassword(password) : findUser.password,
        },
      })

      return {
        success: true,
        message: `Dosen updated successfully`,
        data: {
          nidn: updateDosen.nidn,
          nama_dosen: updateDosen.nama_dosen,
          jenis_kelamin: updateDosen.jenis_kelamin,
          alamat: updateDosen.alamat,
        },
      }

    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      }
    }
  }

  async remove(id: number) {
    try {
      const findDosen = await this.prisma.dosen.findUnique({
        where: { nidn: id },
      })

      if (!findDosen) {
        return {
          success: false,
          message: `Dosen not found`,
          data: null,
        }
      }

      const deleteDosen = await this.prisma.dosen.delete({
        where: { nidn: id },
      })

      const deleteUser = await this.prisma.user.delete({
        where: { id: findDosen.user_id },
      })

      return {
        success: true,
        message: `Dosen deleted successfully`,
        data: {
          nidn: deleteDosen.nidn,
          nama_dosen: deleteDosen.nama_dosen,
          jenis_kelamin: deleteDosen.jenis_kelamin,
          alamat: deleteDosen.alamat,
        }
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong: ${error.message}`,
        data: null,
      }
    }
  }
}
