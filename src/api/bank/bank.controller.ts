import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BankService } from './bank.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { GetAllBankDto } from './dto/get-all-bank.dto';

@Controller('bank-account')
export class BankController {
  constructor(private readonly bankService: BankService) {}

  @Post()
  create(@Body() data: CreateBankDto) {
    return this.bankService.create(data);
  }

  @Get()
  findAll(@Query() query: GetAllBankDto) {
    return this.bankService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bankService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: CreateBankDto) {
    return this.bankService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bankService.remove(id);
  }
}
