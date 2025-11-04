import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Injectable()
export class AttendanceService {
    constructor(private readonly prisma: PrismaService) { }

    async Presensi(createAttendanceDto: CreateAttendanceDto) {
        try {
            const {
                userId,
                date,
                time,
                status
            } = createAttendanceDto

            const findUserId = await this.prisma.user.findUnique({
                where: { id: userId }
            })

            if (!findUserId) {
                return {
                    status: 'failed',
                    message: 'User ID tidak ditemukan',
                    data: null
                }
            }

            const dateObject = new Date(date)

            const createAttendance = await this.prisma.attendance.create({
                data: {
                    userId,
                    date: dateObject,
                    time,
                    status
                }
            })

            return {
                status: 'success',
                message: 'Presensi berhasil dicatat',
                data: {
                    id: createAttendance.id,
                    userId: createAttendance.userId,
                    date: createAttendance.date.toISOString().split('T')[0], // ← Ini yang penting!
                    time: createAttendance.time,
                    status: createAttendance.status
                }
            }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }

    async ShowPresensi(userId: number) {
        try {
            const findUserId = await this.prisma.user.findUnique({
                where: { id: userId }
            })

            if (!findUserId) {
                return {
                    status: 'failed',
                    message: 'User ID tidak ditemukan',
                    data: null
                }
            }

            const showAttendance = await this.prisma.attendance.findMany({
                where: { userId }
            })

            return {
                status: 'success',
                data: showAttendance
            }

        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }

    async RecapBulanan(userId: number) {
        try {
            const findUserId = await this.prisma.user.findUnique({
                where: { id: userId }
            })

            if (!findUserId) {
                return {
                    status: 'failed',
                    message: 'User ID tidak ditemukan',
                    data: null
                }
            }

            const now = new Date()
            const tahun = now.getFullYear()
            const bulan = now.getMonth()

            const startDate = new Date(tahun, bulan, 1)
            const endDate = new Date(tahun, bulan + 1, 1)

            const attendances = await this.prisma.attendance.findMany({
                where: {
                    userId,
                    date: {
                        gte: startDate,
                        lt: endDate
                    }
                }
            })

            const HADIR = attendances.filter(a => a.status.toUpperCase() === 'HADIR').length
            const SAKIT = attendances.filter(a => a.status.toUpperCase() === 'SAKIT').length
            const IZIN = attendances.filter(a => a.status.toUpperCase() === 'SAKIT').length
            const ALPHA = attendances.filter(a => a.status.toUpperCase() === 'ALPHA').length

            return {
                status: 'success',
                data: {
                    userId,
                    month: `${(bulan + 1).toString().padStart(2, '0')}-${tahun}`,
                    attendance_summary: {
                        HADIR,
                        SAKIT,
                        IZIN,
                        ALPHA
                    }
                }
            }
        } catch (error) {
            return new InternalServerErrorException(error)
        }
    }
}
