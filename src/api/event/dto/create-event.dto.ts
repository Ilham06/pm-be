import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateEventDto {
   @IsNotEmpty()
   name: string;

   @IsNotEmpty()
   code: string;

   @IsNotEmpty()
   category: string;

   @IsNotEmpty()
   client_id: string;

   @IsNotEmpty()
   description: string;
   
}
