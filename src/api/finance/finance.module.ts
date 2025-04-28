import { Module } from '@nestjs/common';
import { FinanceService } from './finance.service';
import { FinanceController } from './finance.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService],
  exports: [FinanceService],
  imports: [PrismaModule],
})
export class FinanceModule {}
