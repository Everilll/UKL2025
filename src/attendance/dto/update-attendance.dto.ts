import { AttendanceStatus } from "@prisma/client";
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateAttendanceDto {
    @IsDate()
    @IsOptional()
    date: Date;

    @IsString()
    @IsOptional()
    time: string;

    @IsEnum(AttendanceStatus)
    @IsOptional()
    status: AttendanceStatus;
}