import { IsNotEmpty, IsOptional } from "class-validator";

export class UpdateStatusDto {
   @IsNotEmpty()
   status: number;

   @IsOptional()
   note: string;
}