import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { GetAllRoleDto } from './dto/get-all-role.dto';
import { RoleService } from './role.service';
import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) { }

  @Post()
  create(@Body() data: CreateRoleDto) {
    return this.roleService.create(data)
  }

  @Get()
  findAll(@Query() query: GetAllRoleDto) {
    return this.roleService.findAll(query);
  }

  @Get('/permission')
  findAllPermission() {
    return this.roleService.findAllPermission()
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: CreateRoleDto) {
    return this.roleService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
