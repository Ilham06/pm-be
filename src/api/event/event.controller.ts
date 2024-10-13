import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as ExcelJS from 'exceljs';
import { readExcelFile } from 'src/helpers/excel.utils';
import { storageConfig, fileFilter, limits } from 'src/helpers/file-upload.utils';
import * as fs from 'fs';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('event')
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,  // Menggunakan helper storageConfig
    fileFilter,              // Menggunakan helper fileFilter
    limits                   // Menggunakan batasan file size dari helper
  }))
  async create(@Body() data: CreateEventDto,  // Menangani data selain file
    @UploadedFile() file: Express.Multer.File, @GetUser() user) {
    const savedFileBuffer = fs.readFileSync(file.path);
    return this.eventService.create(data, savedFileBuffer, file, user.sub);

  }

  @Get()
  findAll() {
    return this.eventService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventService.update(+id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(+id);
  }
}
