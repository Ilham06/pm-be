import { IsNotEmpty, IsOptional } from "class-validator";

export class UploadEventDocumentDto {
   @IsNotEmpty()
   type: string;
}