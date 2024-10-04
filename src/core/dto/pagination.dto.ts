import { Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, ValidateIf } from "class-validator";

export class PaginationDto {
  @ValidateIf((obj) => obj.page)
  @Type(() => Number)
  page: number = 1;

  @ValidateIf((obj) => obj.limit)
  @Type(() => Number)
  limit: number = 10;

  @ValidateIf((obj) => obj.sort)
  @IsEnum(["asc", "desc"])
  sort: string = "asc";
}
