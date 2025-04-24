import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards, Query, Put } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig, fileFilter, limits } from 'src/helpers/file-upload.utils';
import { GetUser } from 'src/core/decorators/get-user.decorator';
import * as fs from 'fs';
import { AuthGuard } from '../auth/auth.guard';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

@Controller('finance')
@UseGuards(AuthGuard)
export class FinanceController {
  constructor(private readonly financeService: FinanceService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,  // Menggunakan helper storageConfig
    fileFilter,              // Menggunakan helper fileFilter
    limits                   // Menggunakan batasan file size dari helper
  }))
  create(@Body() data: CreateFinanceDto,  // Menangani data selain file
    @UploadedFile() file: Express.Multer.File, @GetUser() user) {

    return this.financeService.create(data, user.sub);
  }

  @Get()
  findAll(@Query() query: GetAllTransactionDto) {
    return this.financeService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.financeService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: storageConfig,  // Menggunakan helper storageConfig
    fileFilter,              // Menggunakan helper fileFilter
    limits                   // Menggunakan batasan file size dari helper
  }))
  update(@Param('id') id: string, @Body() data: UpdateFinanceDto, @UploadedFile() file: Express.Multer.File) {
    return this.financeService.update({
      id,
      file,
      data,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.financeService.remove(+id);
  }

  @Put(':id/update-status')
  updateStatus(@Param('id') id: string, @Body() data: UpdateStatusDto) {
    return this.financeService.updateStatus({
      id,
      status: data.status,
      note: data.note
    })
  }
}
