import { Injectable } from '@nestjs/common';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { UpdateMatakuliahDto } from './dto/update-matakuliah.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatakuliahService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async create(createMatakuliahDto: CreateMatakuliahDto, user: any) {
    try {
      const {
        id_matakuliah,
        nama_matakuliah,
        id_dosen,
        sks,
      } = createMatakuliahDto;

      if (user.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admin can create matakuliah',
          data: null,
        }
      }

      const existingidmatakuliah = await this.prisma.matakuliah.findUnique({
        where: { id_matakuliah },
      })

      if (existingidmatakuliah) {
        return {
          success: false,
          message: `${id_matakuliah} already exists`,
          data: null,
        }
      }

      const findDosen = await this.prisma.dosen.findUnique({
        where: { nidn: id_dosen },
      })

      if (!findDosen) {
        return {
          success: false,
          message: `Dosen not found`,
          data: null,
        }
      }

      if (sks < 1 || sks > 6) {
        return {
          success: false,
          message: 'SKS must be between 1 and 6',
          data: null,
        }
      }

      const createMatakuliah = await this.prisma.matakuliah.create({
        data: {
          id_matakuliah,
          nama_matakuliah,
          id_dosen,
          sks,
        },
      })

      return {
        success: true,
        message: 'Matakuliah created successfully',
        data: {
          id: createMatakuliah.id,
          id_matakuliah: createMatakuliah.id_matakuliah,
          nama_matakuliah: createMatakuliah.nama_matakuliah,
          id_dosen: createMatakuliah.id_dosen,
          sks: createMatakuliah.sks,
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

  async findAll(user: any) {
    try {
      if (user.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admin can access matakuliah list',
          data: null,
        }
      }

      const matakuliahs = await this.prisma.matakuliah.findMany({
        select: {
          id: true,
          id_matakuliah: true,
          nama_matakuliah: true,
          id_dosen: true,
          sks: true,
        }
      })

      return {
        success: true,
        message: 'Matakuliah retrieved successfully',
        data: matakuliahs
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    };
  }

  async update(id: number, updateMatakuliahDto: UpdateMatakuliahDto, user: any) {
    try {
      const {
        id_matakuliah,
        nama_matakuliah,
        id_dosen,
        sks,
      } = updateMatakuliahDto

      if (user.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admin can update matakuliah',
          data: null,
        }
      }

      const findMatakuliah = await this.prisma.matakuliah.findUnique({
        where: { id }
      })

      if (!findMatakuliah) {
        return {
          success: false,
          message: `Matakuliah not found`,
          data: null,
        }
      }

      const updateMatakuliah = await this.prisma.matakuliah.update({
        where: { id },
        data: {
          id_matakuliah: id_matakuliah ?? findMatakuliah.id_matakuliah,
          nama_matakuliah: nama_matakuliah ?? findMatakuliah.nama_matakuliah,
          id_dosen: id_dosen ?? findMatakuliah.id_dosen,
          sks: sks ?? findMatakuliah.sks,
        },
      })

      return {
        success: true,
        message: 'Matakuliah updated successfully',
        data: updateMatakuliah,
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async remove(id: number, user: any) {
    try {
      if (user.role !== 'ADMIN') {
        return {
          success: false,
          message: 'Only admin can delete matakuliah',
          data: null,
        }
      }

      const findMatakuliah = await this.prisma.matakuliah.findUnique({
        where: { id },
      })

      if (!findMatakuliah) {
        return {
          success: false,
          message: `Matakuliah not found`,
          data: null,
        }
      }

      const deleteMatakuliah = await this.prisma.matakuliah.delete({
        where: { id },
      })

      return {
        success: true,
        message: 'Matakuliah deleted successfully',
        data: deleteMatakuliah,
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
