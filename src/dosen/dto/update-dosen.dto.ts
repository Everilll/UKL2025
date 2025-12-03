import { PartialType } from '@nestjs/mapped-types';
import { CreateDosenDto } from './create-dosen.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { jenis_kelamin } from '@prisma/client';

export class UpdateDosenDto extends PartialType(CreateDosenDto) {
    @IsNumber()
    @IsOptional()
    nidn?: number;

    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    nama_dosen?: string;

    @IsEnum(jenis_kelamin)
    @IsOptional()
    jenis_kelamin?: jenis_kelamin;

    @IsString()
    @IsOptional()
    alamat?: string;
}
