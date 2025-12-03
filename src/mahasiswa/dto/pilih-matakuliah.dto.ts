import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class PilihMatakuliahDto {
    @IsNumber()
    @IsNotEmpty()
    id_mahasiswa: number;

    @IsArray()
    @ArrayNotEmpty()
    id_matakuliah: number[];
}