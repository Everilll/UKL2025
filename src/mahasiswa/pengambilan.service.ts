import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PilihMatakuliahDto } from "./dto/pilih-matakuliah.dto";

@Injectable()
export class PengambilanService {
  constructor(private prisma: PrismaService) {}

  async pilihMatakuliah(dto: PilihMatakuliahDto) {
    try {
        const { id_mahasiswa, id_matakuliah } = dto;
    
        const daftarMatkul = await this.prisma.matakuliah.findMany({
          where: { id: { in: id_matakuliah } },
        });
    
        if (daftarMatkul.length !== id_matakuliah.length) {
          return {
            success: false,
            message: "Beberapa matakuliah tidak ditemukan",
            data: null,
          }
        }
    
        const totalSKS = daftarMatkul.reduce((sum, m) => sum + m.sks, 0);
    
        if (totalSKS < 15) {
          return {
            success: false,
            message: "Total SKS kurang dari 15. Tambah matakuliah lagi",
            data: null,
          }
        }
    
        if (totalSKS > 23) {
          return {
            success: false,
            message: "Total SKS melebihi 23. Kurangi matakuliah",
            data: null,
          }
        }
    
        const jadwalList = await this.prisma.penjadwalan.findMany({
          where: { id_matakuliah: { in: id_matakuliah } },
        });
    
        this.cekBentrok(jadwalList);
    
        for (const jadwal of jadwalList){
          await this.prisma.pengambilan.create({
            data: {
              id_mahasiswa: id_mahasiswa,
              id_penjadwalan: jadwal.id,
              tahun_ajaran: jadwal.tahun_ajaran,
              semester: jadwal.semester,
            },
          });
        }
    
        return {
          status: "success",
          message: "Berhasil memilih matakuliah",
          data: {
            id_mahasiswa,
            id_matakuliah,
            total_sks: totalSKS,
          },
        };
    } catch (error) {
        return {
            success: false,
            message: `Something went wrong: ${error.message}`,
            data: null,
        }
    }
  }

  cekBentrok(jadwalList: any[]) {
    for (let i = 0; i < jadwalList.length; i++) {
      for (let j = i + 1; j < jadwalList.length; j++) {
        const a = jadwalList[i];
        const b = jadwalList[j];

        if (a.hari !== b.hari) continue;

        const startA = Number(a.start_time.replace(":", ""));
        const endA   = Number(a.end_time.replace(":", ""));
        const startB = Number(b.start_time.replace(":", ""));
        const endB   = Number(b.end_time.replace(":", ""));

        const bentrok = startA < endB && startB < endA;

        if (bentrok) {
          return {
            success: false,
            message: `Jadwal bentrok antara matakuliah ID ${a.id_matakuliah} dan ID ${b.id_matakuliah} pada hari ${a.hari}`,
            data: null,
          }
        }
      }
    }
  }
}
