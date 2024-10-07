import { IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllClientDto extends PaginationDto {
    @IsOptional()
    keyword: string;
}
