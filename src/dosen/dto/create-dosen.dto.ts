import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { jenis_kelamin } from "@prisma/client";

export class CreateDosenDto {
    @IsNumber()
    @IsNotEmpty()
    nidn: number;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsNotEmpty()
    nama_dosen: string;

    @IsEnum(jenis_kelamin)
    @IsNotEmpty()
    jenis_kelamin: jenis_kelamin;

    @IsString()
    @IsNotEmpty()
    alamat: string;
}
