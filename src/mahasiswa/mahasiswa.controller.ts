import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { MahasiswaService } from './mahasiswa.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { UpdateMahasiswaDto } from './dto/update-mahasiswa.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';
import { PilihMatakuliahDto } from './dto/pilih-matakuliah.dto';
import { PengambilanService } from './pengambilan.service';

@Controller('api/mahasiswa')
export class MahasiswaController {
  constructor(
    private readonly mahasiswaService: MahasiswaService,
    private readonly pengambilanService: PengambilanService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(@Body() createMahasiswaDto: CreateMahasiswaDto, @Request() req) {
    return this.mahasiswaService.create(createMahasiswaDto, req.user);
  }

  @Post('pilih-matakuliah')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('MAHASISWA')
  pilihMatakuliah(@Body() pilihMatakuliah: PilihMatakuliahDto) {
    return this.pengambilanService.pilihMatakuliah(pilihMatakuliah);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.mahasiswaService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateMahasiswaDto: UpdateMahasiswaDto) {
    return this.mahasiswaService.update(id, updateMahasiswaDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.mahasiswaService.remove(id);
  }
}
