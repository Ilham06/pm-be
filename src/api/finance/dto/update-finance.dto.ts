import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceDto } from './create-finance.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateFinanceDto {
   @IsNotEmpty()
   sender_bank_id: string

   @IsNotEmpty()
   transaction_date: string
}
