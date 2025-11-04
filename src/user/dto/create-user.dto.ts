import { Role } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsString()
    @IsOptional()
    class?: string;

    @IsString()
    @IsOptional()
    position?: string;

    @IsEnum(Role)
    @IsNotEmpty()
    role: Role;
    
}