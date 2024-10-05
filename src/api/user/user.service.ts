import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'
import { GetAllUserDto } from './dto/get-all-user.dto';

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true
      }
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getAll(params: GetAllUserDto) {
    const { page, limit, keyword, status, role_id } = params
    const skip = (page - 1) * limit;

    const where: any = {
      name: keyword ? { contains: keyword, mode: 'insensitive' } : undefined,
      status: status ? status : undefined,
      role_id: role_id ? role_id : undefined,
    };

    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: +limit,
        orderBy: { created_at: 'desc' },
        where: where,
        include: {
          role: true
        }
      }),
      this.prisma.role.count()
    ])
    return { rows, total }
  }

  async create(data: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictException('Email address is already in use.');
    }

    const params = {
      name: data.name,
      email: data.email,
      password: await bcrypt.hash(data.phone, 10),
      role_id: data.role_id,
    };

    return this.prisma.user.create({
      data: params,
    });
  }

  async update(id: string, data: CreateUserDto) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updateData: any = {
      name: data.name || user.name,
      email: data.email || user.email,
      role_id: data.role_id || user.role_id,
    };

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  // Delete a user
  async delete(id: string) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.prisma.user.delete({
      where: { id },
    });

    return null
  }


}
