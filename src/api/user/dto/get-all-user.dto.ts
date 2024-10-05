import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";
import { PaginationDto } from "src/core/dto/pagination.dto";

export class GetAllUserDto extends PaginationDto {
    @IsOptional()
    role_id: string;

    @IsOptional()
    status: any;

    @IsOptional()
    keyword: string;
}
