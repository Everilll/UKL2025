import { PartialType } from '@nestjs/mapped-types';
import { CreateMatakuliahDto } from './create-matakuliah.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateMatakuliahDto extends PartialType(CreateMatakuliahDto) {
    @IsString()
    @IsOptional()
    id_matakuliah?: string;

    @IsString()
    @IsOptional()
    nama_matakuliah?: string;

    @IsNumber()
    @IsOptional()
    id_dosen?: number;

    @IsNumber()
    @IsOptional()
    sks?: number;
}
