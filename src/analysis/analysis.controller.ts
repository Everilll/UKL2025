import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dto/create-analysis.dto';
import { UpdateAnalysisDto } from './dto/update-analysis.dto';
import { AnalysisDto } from './dto/analysis.dto';

@Controller('api/analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('top-matakuliah-dosen')
  analysis(@Body() analysisDto: AnalysisDto) {
    return this.analysisService.analysis(analysisDto);
  }
}
