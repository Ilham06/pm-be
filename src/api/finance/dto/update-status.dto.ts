import { PartialType } from '@nestjs/mapped-types';
import { CreateFinanceDto } from './create-finance.dto';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateStatusDto {
   @IsNotEmpty()
   status: number

   @IsOptional()
   note: string
}
