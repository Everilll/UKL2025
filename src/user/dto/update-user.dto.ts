import { Role } from "@prisma/client";
import { IsEnum, IsOptional, IsString } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsOptional()
    username: string;

    @IsString()
    @IsOptional()
    password: string;

    @IsString()
    @IsOptional()
    class?: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsEnum(Role)
    @IsOptional()
    role: Role;
}