import { IsEmail, isNotEmpty, IsNotEmpty } from "class-validator";

export class CreateRoleDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    code: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    permissions: string[]
}
