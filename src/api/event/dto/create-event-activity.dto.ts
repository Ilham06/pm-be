import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventActivityDto {
   @IsNotEmpty()
   activity: string;

   @IsNotEmpty()
   budget: number;

   @IsNotEmpty()
   plan_start_date: any;

   @IsNotEmpty()
   plan_end_date: any;
   
}
