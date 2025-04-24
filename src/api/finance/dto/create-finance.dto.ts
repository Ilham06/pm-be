import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateFinanceDto {
   @IsNotEmpty()
   event_id: string

   @IsOptional()
   event_activity_id: string

   @IsNotEmpty()
   title: string

   @IsNotEmpty()
   category: string

   @IsNotEmpty()
   amount: number

   @IsNotEmpty()
   destination_bank_id: string

   @IsNotEmpty()
   payment_due_date: string

   @IsOptional()
   note: string
}
