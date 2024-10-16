import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, Req, UseGuards, Query, Put } from '@nestjs/common';
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
import { GetAllEventDto } from './dto/get-all-event.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { CreateEventActivityDto } from './dto/create-event-activity.dto';
import { UpdateEventActivityDto } from './dto/update-event-activity.dto';
import { UploadEventDocumentDto } from './dto/upload-event-document.dto';
import { GetAllEvenDocumenttDto } from './dto/get-all-event-document.dto';

@Controller('event')
@UseGuards(AuthGuard)
export class EventController {
  constructor(private readonly eventService: EventService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,  // Menggunakan helper storageConfig
    fileFilter,              // Menggunakan helper fileFilter
    limits                   // Menggunakan batasan file size dari helper
  }))
  async create(@Body() data: CreateEventDto,  // Menangani data selain file
    @UploadedFile() file: Express.Multer.File, @GetUser() user) {
    const savedFileBuffer = fs.readFileSync(file.path);

    return this.eventService.create({
      data, buffer: savedFileBuffer, file, userId: user.sub
    });

  }

  @Get()
  findAll(@Query() query: GetAllEventDto) {
    return this.eventService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,  // Menggunakan helper storageConfig
    fileFilter,              // Menggunakan helper fileFilter
    limits                   // Menggunakan batasan file size dari helper
  }))
  update(@Param('id') id: string, @Body() data: CreateEventDto, @UploadedFile() file: Express.Multer.File, @GetUser() user) {
    let savedFileBuffer = null;
    if (file) {
      savedFileBuffer = fs.readFileSync(file.path);
    }
    return this.eventService.update({
      id,
      data,
      file,
      buffer: savedFileBuffer,
      userId: user.sub
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventService.remove(id);
  }

  @Put(':id/update-status')
  updateStatus(@Param('id') id: string, @Body() data: UpdateStatusDto) {
    return this.eventService.updateStatus({ id, status: data.status, note: data.note });
  }

  @Post(':id/activity')
  createActivity(@Param('id') id: string, @Body() data: CreateEventActivityDto) {
    return this.eventService.createActivity(id, data)
  }

  @Put(':id/activity')
  updateActivity(@Param('id') id: string, @Body() data: UpdateEventActivityDto) {
    return this.eventService.updateActivity(id, data)
  }

  @Post(':id/upload-document')
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,
    fileFilter,
    limits
  }))
  uploadEventDocument(@Param('id') id: string, @Body() data: UploadEventDocumentDto, @UploadedFile() file: Express.Multer.File, @GetUser() user) {
    return this.eventService.uploadEventDocument({
      id,
      file,
      userId: user.sub,
      type: data.type
    })
  }

  @Get(':id/documents')
  findDocument(@Param('id') id: string, @Query() data: GetAllEvenDocumenttDto) {
    console.log(data)
    return this.eventService.getEventDocument(id, data.type);
  }

  @Put(':id/document/update-status')
  UpdateEventDocumentStatus(@Param('id') id: string, @Body() data: UpdateStatusDto) {
    return this.eventService.updateEventDocumentStatus({
      id,
      status: data.status,
      note: data.note
    })
  }
}
