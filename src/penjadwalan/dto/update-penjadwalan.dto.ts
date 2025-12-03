import { PartialType } from '@nestjs/mapped-types';
import { CreatePenjadwalanDto } from './create-penjadwalan.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { hari } from '@prisma/client';

export class UpdatePenjadwalanDto extends PartialType(CreatePenjadwalanDto) {
    @IsNumber()
    @IsOptional()
    id_dosen?: number;

    @IsNumber()
    @IsOptional()
    id_matakuliah?: number;

    @IsEnum(hari)
    @IsOptional()
    hari?: hari;

    @IsString()
    @IsOptional()
    start_time?: string;

    @IsString()
    @IsOptional()
    end_time?: string;
}
