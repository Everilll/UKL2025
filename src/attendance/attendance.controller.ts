import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { AttendanceAnalysisDto } from './dto/attendance-analysis.dto';

@Controller('api/attendance')
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) { }

    @Post()
    presensi(@Body() createAttendanceDto: CreateAttendanceDto) {
        return this.attendanceService.Presensi(createAttendanceDto);
    }

    @Get('history/:userId')
    findAttendance(@Param('userId') userId: string) {
        return this.attendanceService.ShowPresensi(+userId);
    }

    @Get('summary/:userId')
    recap(@Param('userId') userId: string) {
        return this.attendanceService.RecapBulanan(+userId);
    }

    @Post('analysis')
    getAnalysis(@Body() attendanceAnalysisDto: AttendanceAnalysisDto) {
        return this.attendanceService.analyzeAttendance(attendanceAnalysisDto);
    }
}
