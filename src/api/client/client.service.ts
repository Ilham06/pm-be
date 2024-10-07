import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateClientDto } from './dto/create-client-dto';
import { GetAllClientDto } from './dto/get-all-client-dto';

@Injectable()
export class ClientService {
   constructor(private prisma: PrismaService) {
   }

   async create(data: CreateClientDto) {
      const existingClient = await this.prisma.client.findUnique({
         where: { name: data.name },
      });

      if (existingClient) {
         throw new ConflictException('Client is already in registered.');
      }

      return this.prisma.client.create({
         data
      });
   }

   async findOne(id: string) {
      const client = await this.prisma.client.findUnique({
         where: { id },
      });
      if (!client) {
         throw new NotFoundException('Client not found');
      }
      return client;
   }

   async getAll(params: GetAllClientDto) {
      const { page, limit, keyword } = params
      const skip = (page - 1) * limit;

      const [rows, total] = await Promise.all([
         this.prisma.client.findMany({
            skip,
            take: +limit,
            orderBy: { created_at: 'desc' },
            where: {
               name: {
                  contains: keyword,
                  mode: 'insensitive'
               },
            },
         }),
         this.prisma.client.count()
      ])
      return { rows, total }
   }

   async update(id: string, data: CreateClientDto) {
      const client = await this.findOne(id);
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      return this.prisma.client.update({
        where: { id },
        data,
      });
    }
  
    async delete(id: string) {
      const client = await this.findOne(id);
  
      if (!client) {
        throw new NotFoundException('Client not found');
      }
  
      this.prisma.client.delete({
        where: { id },
      });
  
      return null
    }
}
