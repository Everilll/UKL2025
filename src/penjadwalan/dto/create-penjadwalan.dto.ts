import { hari } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreatePenjadwalanDto {
    @IsNumber()
    @IsNotEmpty()
    id_dosen: number;

    @IsNumber()
    @IsNotEmpty()
    id_matakuliah: number;

    @IsEnum(hari)
    @IsNotEmpty()
    hari: hari;

    @IsString()
    @IsNotEmpty()
    start_time: string;

    @IsString()
    @IsNotEmpty()
    end_time: string;
}