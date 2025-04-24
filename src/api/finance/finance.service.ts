import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFinanceDto } from './dto/create-finance.dto';
import { UpdateFinanceDto } from './dto/update-finance.dto';
import { ChangeStatusInterface, CreateTransactionInterface, UpdateTransactionInterface } from './interfaces';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAllTransactionDto } from './dto/get-all-transaction.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) { }

  async create(data: CreateFinanceDto, user_id: string) {

    const transactionCode = `trx/${Math.floor(Math.random() * 10000)}/${new Date().getFullYear()}`;

    return await this.prisma.eventFinance.create({
      data: {
        event: {
          connect: { id: data.event_id },
        },
        is_activity: !!data.event_activity_id,

        ...(data.event_activity_id && {
          event_activity: {
            connect: { id: data.event_activity_id },
          },
        }),
        title: data.title,
        category: data.category,
        note: data.note,
        amount: data.amount,
        payment_due_date: new Date(data.payment_due_date),

        ...(data.destination_bank_id && {
          destination_bank: {
            connect: { id: data.destination_bank_id },
          },
        }),
        status: '0',
        transaction_code: transactionCode,
        user: {
          connect: { id: user_id },
        },
      },
    });
  }

  async findAll(params: GetAllTransactionDto) {
    const { page, limit, keyword, category, status, date, sort } = params;
    const skip = (page - 1) * limit;

    const whereCondition: any = {
      title: { contains: keyword, mode: 'insensitive' },
      ...(category && { category: { contains: category, mode: 'insensitive' } }),
      ...(status && { status }),
      ...(date && { transaction_date: new Date(date) }),
    };

    const [rows, total] = await Promise.all([
      this.prisma.eventFinance.findMany({
        skip,
        take: +limit,
        orderBy: { created_at: 'desc' },
        where: whereCondition,
      }),
      this.prisma.eventFinance.count({ where: whereCondition }),
    ]);

    return { rows, total };
  }

  async findOne(id: string) {
    const event = await this.prisma.eventFinance.findUnique({
      where: { id },
      include: {
        event_activity: true,
        sender_bank: true,
        destination_bank: true
      }
    });

    if (!event) {
      throw new NotFoundException(`Transaction not found`);
    }

    return event;
  }

  async update({ id, file, data }: UpdateTransactionInterface) {
    const transactionExist = await this.findOne(id)
    if (!transactionExist) {
      throw new NotFoundException(`Transaction not found`);
    }

    if (transactionExist && transactionExist.status != '1') {
      throw new NotFoundException(`Transaction is not approved`);
    }

    return this.prisma.$transaction(async (prisma) => {
      const updatedEvent = await prisma.eventFinance.update({
        where: { id },
        data: {
          sender_bank: {
            connect: { id: data.sender_bank_id }
          },
          transaction_date: new Date(data.transaction_date),
          status: "2"
        }
      });

      await prisma.eventFinanceDocument.create({
        data: {
          event_finance_id: id,
          file_type: file.mimetype,
          file_size: file.size.toString(),
          file_name: file.filename,
          document_type: 'Transaction Confirm',
          path: file.path,
        },
      });


      return updatedEvent;
    });
  }

  remove(id: number) {
    return `This action removes a #${id} finance`;
  }

  async updateStatus({ id, status, note }: ChangeStatusInterface) {
    const trx = await this.findOne(id);

    if (!trx) {
      throw new NotFoundException('Transaction not found');
    }

    return this.prisma.eventFinance.update({
      where: { id },
      data: {
        status: status.toString(),
        note
      },
    });
  }
}
