import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
   @Post()
   create(@Body() data: CreateUserDto ) {
      return data;
   }
}
