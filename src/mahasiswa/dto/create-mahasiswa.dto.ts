import { jenis_kelamin, role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsString } from "class-validator";

export class CreateMahasiswaDto {
    @IsString()
    @IsNotEmpty()
    nim: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    nama_mahasiswa: string;

    @IsEnum(jenis_kelamin)
    @IsNotEmpty()
    jenis_kelamin: jenis_kelamin;

    @IsString()
    @IsNotEmpty()
    jurusan: string;
}
