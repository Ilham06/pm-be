import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { ClientService } from './client.service';
import { GetAllClientDto } from './dto/get-all-client-dto';
import { CreateClientDto } from './dto/create-client-dto';

@Controller('client')
@UseGuards(AuthGuard)
export class ClientController {
   constructor(private readonly clientService: ClientService) { }

   @Get()
   getAll(@Query() query: GetAllClientDto) {
      return this.clientService.getAll(query);
   }

   @Post()
   create(@Body() data: CreateClientDto) {
      return this.clientService.create(data)
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.clientService.findOne(id);
   }

   @Put(':id')
   update(@Param('id') id: string, @Body() data: CreateClientDto) {
      return this.clientService.update(id, data);
   }

   @Delete(':id')
   delete(@Param('id') id: string) {
      return this.clientService.delete(id);
   }
}
