import { IsString } from "class-validator";

export class AnalysisDto {
    @IsString()
    tahun_ajaran?: string;

    @IsString()
    semester?: string;

    @IsString()
    limit?: number;
}