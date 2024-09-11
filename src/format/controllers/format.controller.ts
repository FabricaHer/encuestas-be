import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { FormatService } from '../services/format.service';
import { CreateFormatDto } from '../dto/create-format.dto';
import { UpdateFormatDto } from '../dto/update-format.dto';

@Controller('format')
export class FormatController {
  constructor(private readonly formatService: FormatService) {}

  @Post()
  create(@Body() createFormatDto: CreateFormatDto) {
    return this.formatService.create(createFormatDto);
  }

  @Get()
  findAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('status') status?: boolean,
    @Query('search') search?: string,
  ) {
    return this.formatService.findAll(page, limit, status, search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formatService.findOne(+id);
  }

  @Get('/bed/:bed')
  getFormatByBed(@Param('bed') bed: string) {
    return this.formatService.getFormatByBed(bed);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormatDto: UpdateFormatDto) {
    return this.formatService.update(+id, updateFormatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formatService.remove(+id);
  }
}
