import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, Put, UseGuards, Request, Query } from '@nestjs/common';
import { DosenService } from './dosen.service';
import { CreateDosenDto } from './dto/create-dosen.dto';
import { UpdateDosenDto } from './dto/update-dosen.dto';
import { AuthGuard } from '@nestjs/passport';
import { QueryDosenDto } from './dto/query-dosen.dto';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

@Controller('api/dosen')
export class DosenController {
  constructor(private readonly dosenService: DosenService) { }

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(@Body() createDosenDto: CreateDosenDto) {
    return this.dosenService.create(createDosenDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.dosenService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updateDosenDto: UpdateDosenDto) {
    return this.dosenService.update(+id, updateDosenDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.dosenService.remove(+id);
  }
}
