import { IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllRoleDto extends PaginationDto {
  @IsOptional()
  keyword: string;
}
