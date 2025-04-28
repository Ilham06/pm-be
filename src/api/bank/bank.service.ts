import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { GetAllBankDto } from './dto/get-all-bank.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BankService {
  constructor(private prisma: PrismaService) {
  }

  async create(data: CreateBankDto) {

    return this.prisma.bankAccount.create({
      data
    });
  }

  async findAll(params: GetAllBankDto) {
    const { page, limit, keyword } = params
    const skip = (page - 1) * limit;

    const [rows, total] = await Promise.all([
      this.prisma.bankAccount.findMany({
        skip,
        take: +limit,
        orderBy: { created_at: 'desc' },
        where: {
          bank_account: {
            contains: keyword,
            mode: 'insensitive'
          },
        },
      }),
      this.prisma.bankAccount.count()
    ])
    return { rows, total }
  }

  async findOne(id: string) {
    const bank = await this.prisma.bankAccount.findUnique({
      where: { id },
    });
    if (!bank) {
      throw new NotFoundException('Bank Account not found');
    }
    return bank;
  }

  async update(id: string, data: CreateBankDto) {
    const bank = await this.findOne(id);
  
    if (!bank) {
      throw new NotFoundException('Bank Account not found');
    }

    return this.prisma.bankAccount.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const bank = await this.findOne(id);
  
      if (!bank) {
        throw new NotFoundException('Bank Account not found');
      }
  
      return this.prisma.bankAccount.delete({
        where: { id },
      });
  
  }
}
