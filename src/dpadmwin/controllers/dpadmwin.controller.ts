import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DpadmwinService } from '../services/dpadmwin.service';

@Controller('dpadmwin')
export class DpadmwinController {
  constructor(private readonly dpadmwinService: DpadmwinService) {}

  @Get('bed')
  findAllBed() {
    return this.dpadmwinService.findAllBed();
  }

  @Get('patientList')
  findPatientList() {
    return this.dpadmwinService.findPatientList();
  }

  @Get('admission/:id')
  getAdmission(@Param('id') admisssion: string) {
    return this.dpadmwinService.getAdmission(admisssion);
  }
}
