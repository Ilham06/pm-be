import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [BankController],
  providers: [BankService],
  exports: [BankService],
  imports: [PrismaModule],
})
export class BankModule {}
