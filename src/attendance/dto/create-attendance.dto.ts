import { AttendanceStatus } from "@prisma/client";
import { Type } from "class-transformer";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateAttendanceDto {
    @IsNumber()
    @IsNotEmpty()
    @Type(()=> Number)
    userId: number;

    @IsDate()
    @IsNotEmpty()
    date: Date;

    @IsString()
    @IsNotEmpty()
    time: string;

    @IsEnum(AttendanceStatus)
    @IsNotEmpty()
    status: AttendanceStatus;
}