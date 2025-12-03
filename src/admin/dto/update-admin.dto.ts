import { PartialType } from '@nestjs/mapped-types';
import { CreateAdminDto } from './create-admin.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto extends PartialType(CreateAdminDto) {
    @IsString()
    @IsOptional()
    username?: string;

    @IsString()
    @IsOptional()
    password?: string;
}
