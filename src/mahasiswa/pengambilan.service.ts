import { BadRequestException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PilihMatakuliahDto } from "./dto/pilih-matakuliah.dto";

@Injectable()
export class PengambilanService {
    constructor(private prisma: PrismaService) { }

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

            for (const jadwal of jadwalList) {
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

    async lihatJadwal(id_user: number) {
        // ambil mahasiswa berdasarkan user_id
        const mahasiswa = await this.prisma.mahasiswa.findUnique({
            where: { user_id: id_user }
        });

        if (!mahasiswa) {
            return {
                status: "error",
                message: "Mahasiswa tidak ditemukan",
                data: null
            };
        }

        // ambil semua pengambilan matakuliah oleh mahasiswa ini
        const pengambilan = await this.prisma.pengambilan.findMany({
            where: { id_mahasiswa: mahasiswa.id },
            include: {
                penjadwalan: {
                    include: {
                        matakuliah: true,
                        dosen: true,
                    },
                },
            },
        });

        if (pengambilan.length === 0) {
            return {
                status: "error",
                message: "Belum ada matakuliah yang diambil",
                data: null,
            };
        }

        // mapping ke format yang diminta SMK Telkom
        const jadwal = pengambilan.map((item) => {
            const j = item.penjadwalan;

            return {
                id_penjadwalan: j.id,
                id_matakuliah: j.id_matakuliah,
                nama_matakuliah: j.matakuliah.nama_matakuliah,
                dosen: j.dosen.nama_dosen,
                hari: j.hari,
                start_time: j.start_time,
                end_time: j.end_time
            };
        });

        return {
            status: "success",
            message: "Berhasil mengambil jadwal",
            data: {
                matakuliah: jadwal
            },
        };
    }

    async deleteJadwal(id_user: number, id_penjadwalan: number) {
        // cari mahasiswa berdasarkan user login
        const mahasiswa = await this.prisma.mahasiswa.findUnique({
            where: { user_id: id_user }
        });

        if (!mahasiswa) {
            return {
                status: "error",
                message: "Mahasiswa tidak ditemukan",
                data: null,
            };
        }

        // cek apakah jadwal ini benar dimiliki mahasiswa
        const pengambilan = await this.prisma.pengambilan.findFirst({
            where: {
                id_mahasiswa: mahasiswa.id,
                id_penjadwalan: id_penjadwalan,
            },
        });

        if (!pengambilan) {
            return {
                status: "error",
                message: "Jadwal tidak ditemukan atau bukan milik mahasiswa ini",
                data: null,
            };
        }

        // hapus record
        await this.prisma.pengambilan.delete({
            where: { id: pengambilan.id },
        });

        return {
            status: "success",
            message: "Berhasil menghapus jadwal matakuliah",
            data: {
                id_penjadwalan,
            },
        };
    }



    cekBentrok(jadwalList: any[]) {
        for (let i = 0; i < jadwalList.length; i++) {
            for (let j = i + 1; j < jadwalList.length; j++) {
                const a = jadwalList[i];
                const b = jadwalList[j];

                if (a.hari !== b.hari) continue;

                const startA = Number(a.start_time.replace(":", ""));
                const endA = Number(a.end_time.replace(":", ""));
                const startB = Number(b.start_time.replace(":", ""));
                const endB = Number(b.end_time.replace(":", ""));

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
