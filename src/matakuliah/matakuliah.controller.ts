import { Controller, Get, Post, Body, Patch, Param, Delete, Request, Put, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MatakuliahService } from './matakuliah.service';
import { CreateMatakuliahDto } from './dto/create-matakuliah.dto';
import { UpdateMatakuliahDto } from './dto/update-matakuliah.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

@Controller('api/matakuliah')
export class MatakuliahController {
  constructor(private readonly matakuliahService: MatakuliahService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(@Body() createMatakuliahDto: CreateMatakuliahDto) {
    return this.matakuliahService.create(createMatakuliahDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.matakuliahService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateMatakuliahDto: UpdateMatakuliahDto) {
    return this.matakuliahService.update(+id, updateMatakuliahDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.matakuliahService.remove(+id);
  }
}
