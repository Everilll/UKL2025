import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Put } from '@nestjs/common';
import { PenjadwalanService } from './penjadwalan.service';
import { CreatePenjadwalanDto } from './dto/create-penjadwalan.dto';
import { UpdatePenjadwalanDto } from './dto/update-penjadwalan.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/helper/roles-guard';
import { Roles } from 'src/helper/roles.decorator';

@Controller('api/penjadwalan')
export class PenjadwalanController {
  constructor(private readonly penjadwalanService: PenjadwalanService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  create(@Body() createPenjadwalanDto: CreatePenjadwalanDto) {
    return this.penjadwalanService.create(createPenjadwalanDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  findAll() {
    return this.penjadwalanService.findAll();
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() updatePenjadwalanDto: UpdatePenjadwalanDto) {
    return this.penjadwalanService.update(+id, updatePenjadwalanDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.penjadwalanService.remove(+id);
  }
}
