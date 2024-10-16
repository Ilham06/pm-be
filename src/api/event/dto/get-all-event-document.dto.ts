import { IsNotEmpty, IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllEvenDocumenttDto {
   @IsOptional()
   type: string;
}
