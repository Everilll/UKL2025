import { PartialType } from '@nestjs/mapped-types';
import { CreateMahasiswaDto } from './create-mahasiswa.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { jenis_kelamin, role } from '@prisma/client';

export class UpdateMahasiswaDto extends PartialType(CreateMahasiswaDto) {
    @IsString()
    @IsOptional()
    nim?: string;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    nama_mahasiswa?: string;

    @IsEnum(jenis_kelamin)
    @IsOptional()
    jenis_kelamin?: jenis_kelamin;

    @IsString()
    @IsOptional()
    jurusan?: string;
}
