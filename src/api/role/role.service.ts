import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { GetAllRoleDto } from './dto/get-all-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { throwError } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RoleService {
   constructor(private prisma: PrismaService) {
   }

   async findAll(params: GetAllRoleDto) {
      const { page, limit, keyword, sort } = params
      const skip = (page - 1) * limit;


      const [rows, total] = await Promise.all([
         this.prisma.role.findMany({
            skip,
            take: +limit,
            orderBy: { created_at: 'desc' },
            where: {
               name: {
                  contains: keyword,
                  mode: 'insensitive'
               },
            },
            include: {
               _count: {
                  select: { permissions: true, users: true } // Menghitung total relasi permission
               }
            }
         }),
         this.prisma.role.count()
      ])
      return { rows, total }
   }

   async findAllPermission() {
      const permissions = await this.prisma.permission.findMany({
         orderBy: { created_at: 'desc' },
      })

      return permissions
   }

   async findOne(id: string) {
      const role = await this.prisma.role.findUnique({
         where: { id }, 
         include: {
            permissions: {
               select: {
                  permission: true
               }
            },
         }
      });
      if (!role) {
         throw new NotFoundException('Role not found');
      }
      return role;
   }

   async findByName(name: string) {
      return this.prisma.role.findUnique({ where: { name } });
   }

   async create(data: CreateRoleDto) {
      const existingRole = await this.findByName(data.name);

      if (existingRole) {
         throw new ConflictException('Role already registered');
      }

      return this.prisma.$transaction(async (prisma) => {
         const newRole = await prisma.role.create({
            data: {
               name: data.name,
               code: data.code,
               description: data.description,
            },
         });

         const permissionsData = data.permissions.map(permissionId => ({
            role_id: newRole.id,
            permission_id: permissionId,
         }));

         await prisma.rolePermission.createMany({
            data: permissionsData,
         });

         return newRole;
      });
   }

   async update(id: string, data: CreateRoleDto) {
      // Check if the role exists
      const existingRole = await this.findOne(id);
      if (!existingRole) {
         throw new NotFoundException('Role not found');
      }

      // Using transaction for update
      return this.prisma.$transaction(async (prisma) => {
         const updatedRole = await prisma.role.update({
            where: { id },
            data: {
               name: data.name,
               code: data.code,
               description: data.description,
            },
         });

         // Delete existing permissions to replace them with the new ones
         await prisma.rolePermission.deleteMany({
            where: { role_id: id },
         });

         const permissionsData = data.permissions.map(permissionId => ({
            role_id: updatedRole.id,
            permission_id: permissionId,
         }));

         await prisma.rolePermission.createMany({
            data: permissionsData,
         });

         return updatedRole;
      });
   }

   async delete(id: string) {
      // Check if the role exists
      const existingRole = await this.findOne(id);
      if (!existingRole) {
         throw new NotFoundException('Role not found');
      }

      // Using transaction for delete
      this.prisma.$transaction(async (prisma) => {
         // Delete related role-permission entries first
         await prisma.rolePermission.deleteMany({
            where: { role_id: id },
         });

         // Then delete the role
         return prisma.role.delete({
            where: { id },
         });
      });

      return null
   }

}
