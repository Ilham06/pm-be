import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateEventActivityDto {
   @IsNotEmpty()
   actual_start_date: any;

   @IsOptional()
   actual_end_date: any;

   @IsOptional()
   status: number;
   
}
