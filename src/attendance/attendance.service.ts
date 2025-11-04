import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceAnalysisDto } from './dto/attendance-analysis.dto';

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
                    date: createAttendance.date.toISOString().split('T')[0],
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

    async analyzeAttendance(attendanceAnalysisDto: AttendanceAnalysisDto) {
    const startDate = new Date(attendanceAnalysisDto.startDate)
    const endDate = new Date(attendanceAnalysisDto.endDate)
    endDate.setHours(23, 59, 59, 999)

    const attendances = await this.prisma.attendance.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        user: true,
      },
    })

    const totalAttendance = attendances.length

    const hadir = attendances.filter((a) => a.status === 'HADIR').length
    const izin = attendances.filter((a) => a.status === 'IZIN').length
    const sakit = attendances.filter((a) => a.status === 'SAKIT').length
    const alpha = attendances.filter((a) => a.status === 'ALPHA').length

    const hadirPercentage = this.calculatePercentage(hadir, totalAttendance)
    const izinPercentage = this.calculatePercentage(izin, totalAttendance)
    const sakitPercentage = this.calculatePercentage(sakit, totalAttendance)
    const alphaPercentage = this.calculatePercentage(alpha, totalAttendance)

    let groupedAnalysis = []
    if (attendanceAnalysisDto.groupBy) {
      this.getGroupedAnalysis(attendances, attendanceAnalysisDto.groupBy)
    }

    return {
      status: 'success',
      data: {
        analysis_period: {
          start_date: attendanceAnalysisDto.startDate,
          end_date: attendanceAnalysisDto.endDate,
        },
        grouped_analysis: groupedAnalysis,
        total_attendance: {
          hadir: hadir,
          izin: izin,
          sakit: sakit,
          alpha: alpha,
        },
        attendance_rate: {
          hadir_percentage: hadirPercentage,
          izin_percentage: izinPercentage,
          sakit_percentage: sakitPercentage,
          alpha_percentage: alphaPercentage,
        },
      },
    }
  }

  private calculatePercentage(value: number, total: number): string {
    if (total === 0) return '0%'
    return ((value / total) * 100).toFixed(1) + '%'
  }

  private getGroupedAnalysis(attendances: any[], groupBy: string) {
    const groups = {}

    attendances.forEach((attendance) => {
      let groupKey

      if (groupBy === 'kelas' && attendance.user.class) {
        groupKey = attendance.user.class
      } else if (groupBy === 'jabatan' && attendance.user.position) {
        groupKey = attendance.user.position
      } else {
        groupKey = attendance.user.role
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpha: 0,
          total: 0,
        }
      }

      groups[groupKey].total++

      if (attendance.status === 'HADIR') groups[groupKey].hadir++
      else if (attendance.status === 'IZIN') groups[groupKey].izin++
      else if (attendance.status === 'SAKIT') groups[groupKey].sakit++
      else if (attendance.status === 'ALPHA') groups[groupKey].alpha++
    })

    return Object.keys(groups).map((groupName) => {
      const data = groups[groupName]
      const total = data.total

      return {
        group: groupName,
        total_users: total,
        attendance_rate: {
          hadir_percentage: this.calculatePercentage(data.hadir, total),
          izin_percentage: this.calculatePercentage(data.izin, total),
          sakit_percentage: this.calculatePercentage(data.sakit, total),
          alpha_percentage: this.calculatePercentage(data.alpha, total),
        },
      }
    })
  }
}
