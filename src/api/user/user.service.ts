import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'

// This should be a real class/interface representing a user entity
export type User = any;

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {
  }

  async findOne(email: string): Promise<User | undefined> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    })
  }

  async create(data: CreateUserDto) {
    // throw new Error('Email address is already in use.');
    try {
      const user = await this.findOne(data.email)
      
      if (user) {
        throw new Error('Email address is already in use.');
      }
      const params = {
        name: data.name,
        email: data.email,
        password: await bcrypt.hash(data.password, 10),
        role_id: 'd76fc88a-70fd-4e72-9072-b12b2988e1ef'
      }

      return this.prisma.user.create({
        data: params
      })
    } catch (error) {
      throw error
    }
  }


}
