import { IsNotEmpty, IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllTransactionDto extends PaginationDto {
   @IsOptional()
   keyword: string;

   @IsOptional()
   category: string;

   @IsOptional()
   status: number;

   @IsOptional()
   date: string;
   
}
