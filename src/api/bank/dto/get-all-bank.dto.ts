import { IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllBankDto extends PaginationDto {
    @IsOptional()
    keyword: string;
}
