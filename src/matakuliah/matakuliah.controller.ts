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
  create(@Body() createMatakuliahDto: CreateMatakuliahDto, @Request() req) {
    return this.matakuliahService.create(createMatakuliahDto, req.user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll(@Request() req) {
    return this.matakuliahService.findAll(req.user);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateMatakuliahDto: UpdateMatakuliahDto, @Request() req) {
    return this.matakuliahService.update(+id, updateMatakuliahDto, req.user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string, @Request() req) {
    return this.matakuliahService.remove(+id, req.user);
  }
}
