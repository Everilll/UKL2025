import { Injectable } from '@nestjs/common';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AnalysisDto } from './dto/analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    private prisma: PrismaService,
  ) { }

  async analysis(analysisDto: AnalysisDto) {
    try {
      const { tahun_ajaran, semester, limit = 10 } = analysisDto;

      const wherePengambilan: any = {};
      const wherePenjadwalan: any = {};

      if (tahun_ajaran) {
        wherePengambilan.tahun_ajaran = tahun_ajaran;
        wherePenjadwalan.tahun_ajaran = tahun_ajaran;
      }

      if (semester) {
        wherePengambilan.semester = String(semester);
        wherePenjadwalan.semester = String(semester);
      }

      const topMatakuliah = await this.prisma.pengambilan.groupBy({
        by: ["id_penjadwalan"],
        where: wherePengambilan,
        _count: { id_penjadwalan: true },
        orderBy: { _count: { id_penjadwalan: "desc" } },
        take: limit,
      });

      const matkulDetail = await Promise.all(
        topMatakuliah.map(async (item) => {
          const jadwal = await this.prisma.penjadwalan.findFirst({
            where: {
              id: item.id_penjadwalan,
              ...wherePenjadwalan,     // <-- FIX PENTING
            },
            include: {
              matakuliah: true,
              dosen: true,
            },
          });

          if (!jadwal || !jadwal.matakuliah) {
            return {
              id_matakuliah: null,
              nama_matakuliah: null,
              id_dosen: null,
              nama_dosen: null,
              total_mahasiswa_memilih: item._count.id_penjadwalan,
              total_sks_diambil: 0,
            };
          }

          return {
            id_matakuliah: jadwal.matakuliah.id,
            nama_matakuliah: jadwal.matakuliah.nama_matakuliah,
            id_dosen: jadwal.dosen?.nidn ?? null,
            nama_dosen: jadwal.dosen?.nama_dosen ?? null,
            total_mahasiswa_memilih: item._count.id_penjadwalan,
            total_sks_diambil: item._count.id_penjadwalan * (jadwal.matakuliah.sks ?? 0),
          };
        })
      );

      const topDosen = await this.prisma.penjadwalan.groupBy({
        by: ["id_dosen"],
        where: wherePenjadwalan,
        _count: { id: true },
        orderBy: { _count: { id: "desc" } },
        take: limit,
      });

      const dosenDetail = await Promise.all(
        topDosen.map(async (item) => {
          const dosenData = await this.prisma.dosen.findUnique({
            where: { nidn: item.id_dosen },
          });

          const totalPengambilan = await this.prisma.pengambilan.count({
            where: {
              ...wherePengambilan,
              penjadwalan: { id_dosen: item.id_dosen },
            },
          });

          return {
            id_dosen: item.id_dosen,
            nama_dosen: dosenData?.nama_dosen ?? null,
            total_matakuliah_diampu: item._count.id,
            total_pengambilan_matakuliah: totalPengambilan,
          };
        })
      );

      return {
        status: "success",
        message: "Berhasil melakukan analisis",
        data: {
          top_matakuliah: matkulDetail,
          top_dosen: dosenDetail,
        },
      };

    } catch (error) {
      console.log(error);
      return {
        status: "error",
        message: "Analysis failed",
        data: null,
      };
    }
  }

}
