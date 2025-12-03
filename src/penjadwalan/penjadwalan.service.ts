import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/bcrypt/bcrypt.service';

@Injectable()
export class PenjadwalanService {
  constructor(
    private prisma: PrismaService,
    private readonly bcrypt: BcryptService,
  ) { }

  async create(createPenjadwalanDto: CreatePenjadwalanDto) {
    try {
      const {
        id_matakuliah,
        hari,
        start_time,
        end_time,
        tahun_ajaran,
        semester,
      } = createPenjadwalanDto;

      const findMatakuliah = await this.prisma.matakuliah.findUnique({
        where: { id: id_matakuliah },
      });

      if (!findMatakuliah) {
        return {
          success: false,
          message: `Matakuliah not found`,
          data: null,
        };
      }

      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

      if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
        throw new BadRequestException("Format jam harus HH:MM (00-23:59)");
      }

      function toMinutes(time: string) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
      }

      if (toMinutes(start_time) >= toMinutes(end_time)) {
        throw new BadRequestException("start_time harus lebih awal dari end_time");
      }

      const existing = await this.prisma.penjadwalan.findMany({
        where: {
          id_matakuliah,
          hari,
          semester: String(semester),  // karena kolom semester = String
          tahun_ajaran,
        },
      });

      function isOverlap(startA: string, endA: string, startB: string, endB: string): boolean {
        const aStart = Number(startA.replace(":", ""));
        const aEnd = Number(endA.replace(":", ""));
        const bStart = Number(startB.replace(":", ""));
        const bEnd = Number(endB.replace(":", ""));
        return aStart < bEnd && bStart < aEnd;
      }

      for (const jadwal of existing) {
        if (isOverlap(start_time, end_time, jadwal.start_time, jadwal.end_time)) {
          return {
            success: false,
            message: `Matakuliah ini sudah dijadwalkan di hari ${hari} pada waktu yang sama/bentrok`,
            data: null,
          };
        }
      }
      const createPenjadwalan = await this.prisma.penjadwalan.create({
        data: {
          id_dosen: findMatakuliah.id_dosen,
          id_matakuliah,
          hari,
          start_time,
          end_time,
          tahun_ajaran,
          semester,
        },
      });

      return {
        success: true,
        message: `Penjadwalan created successfully`,
        data: {
          id: createPenjadwalan.id,
          id_dosen: createPenjadwalan.id_dosen,
          id_matakuliah: createPenjadwalan.id_matakuliah,
          jadwal: `${createPenjadwalan.hari} ${createPenjadwalan.start_time}-${createPenjadwalan.end_time}`,
          tahun_ajaran: createPenjadwalan.tahun_ajaran,
          semester: createPenjadwalan.semester,
        },
      };

    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      };
    }
  }


  async findAll() {
    try {
      const penjadwalan = await this.prisma.penjadwalan.findMany({
        include: {
          matakuliah: {
            select: { id: true, id_matakuliah: true, nama_matakuliah: true }
          },
          dosen: {
            select: { nidn: true, nama_dosen: true }
          }
        },
      })

      return {
        success: true,
        message: `Penjadwalan retrieved successfully`,
        data: penjadwalan
      }
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong ${error.message}`,
        data: null,
      }
    }
  }

  async update(id: number, updatePenjadwalanDto: UpdatePenjadwalanDto) {
    try {
      const {
        id_dosen,
        id_matakuliah,
        hari,
        start_time,
        end_time,
        tahun_ajaran,
        semester,
      } = updatePenjadwalanDto;

      const findPenjadwalan = await this.prisma.penjadwalan.findUnique({
        where: { id },
      })

      if (!findPenjadwalan) {
        return {
          success: false,
          message: `Penjadwalan with ID ${id} not found`,
          data: null,
        }
      }

      const findDosen = await this.prisma.dosen.findUnique({
        where: { nidn: findPenjadwalan.id_dosen },
      })

      if (!findDosen) {
        return {
          success: false,
          message: `Dosen not found`,
          data: null,
        }
      }

      const findMatakuliah = await this.prisma.matakuliah.findUnique({
        where: { id: findPenjadwalan.id_matakuliah },
      })

      if (!findMatakuliah) {
        return {
          success: false,
          message: `Matakuliah not found`,
          data: null,
        }
      }

      const timeRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

      if (start_time && !timeRegex.test(start_time)) {
        throw new BadRequestException("Format start_time harus HH:MM");
      }

      if (end_time && !timeRegex.test(end_time)) {
        throw new BadRequestException("Format end_time harus HH:MM");
      }

      function toMinutes(time: string) {
        const [h, m] = time.split(":").map(Number);
        return h * 60 + m;
      }

      const finalStart = start_time ?? findPenjadwalan.start_time;
      const finalEnd = end_time ?? findPenjadwalan.end_time;

      if (toMinutes(finalStart) >= toMinutes(finalEnd)) {
        throw new BadRequestException("start_time harus lebih awal dari end_time");
      }


      const updatePenjadwalan = await this.prisma.penjadwalan.update({
        where: { id },
        data: {
          id_dosen: id_dosen ?? findPenjadwalan.id_dosen,
          id_matakuliah: id_matakuliah ?? findPenjadwalan.id_matakuliah,
          hari: hari ?? findPenjadwalan.hari,
          start_time: start_time ?? findPenjadwalan.start_time,
          end_time: end_time ?? findPenjadwalan.end_time,
          tahun_ajaran: tahun_ajaran ?? findPenjadwalan.tahun_ajaran,
          semester: semester ?? findPenjadwalan.semester,
        },
      })

      return {
        success: true,
        message: `Penjadwalan updated successfully`,
        data: {
          id: updatePenjadwalan.id,
          id_dosen: updatePenjadwalan.id_dosen,
          id_matakuliah: updatePenjadwalan.id_matakuliah,
          jadwal: `${updatePenjadwalan.hari} ${updatePenjadwalan.start_time}-${updatePenjadwalan.end_time}`,
          tahun_ajaran: updatePenjadwalan.tahun_ajaran,
          semester: updatePenjadwalan.semester,
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

  async remove(id: number) {
    try {
      const findPenjadwalan = await this.prisma.penjadwalan.findUnique({
        where: { id },
      })

      if (!findPenjadwalan) {
        return {
          success: false,
          message: `Penjadwalan with ID ${id} not found`,
          data: null,
        }
      }

      const deletePenjadwalan = await this.prisma.penjadwalan.delete({
        where: { id },
      });

      return {
        success: true,
        message: `Penjadwalan with ID ${id} deleted successfully`,
        data: deletePenjadwalan,
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
