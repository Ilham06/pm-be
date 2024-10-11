import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UsersService } from './user.service';
import { GetAllUserDto } from './dto/get-all-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
   constructor(private readonly userService: UsersService) { }

   @Get()
   getAll(@Query() query: GetAllUserDto) {
      return this.userService.getAll(query);
   }

   @Post()
   create(@Body() data: CreateUserDto) {
      return this.userService.create(data)
   }

   @Get(':id')
   findOne(@Param('id') id: string) {
      return this.userService.findOne(id);
   }

   // Update a user by ID
   @Put(':id')
   update(@Param('id') id: string, @Body() data: CreateUserDto) {
      return this.userService.update(id, data);
   }

   // Delete a user by ID
   @Delete(':id')
   delete(@Param('id') id: string) {
      return this.userService.delete(id);
   }

   @Put(':id/update-status')
   updateStatus(@Param('id') id: string, @Body() status: number) {
      return this.userService.updateStatus(id, status);
   }
}
