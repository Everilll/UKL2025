import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMatakuliahDto {
    @IsString()
    @IsNotEmpty()
    id_matakuliah: string;

    @IsString()
    @IsNotEmpty()
    nama_matakuliah: string
    
    @IsNumber()
    @IsNotEmpty()
    id_dosen: number;

    @IsNumber()
    @IsNotEmpty()
    sks: number;
}
