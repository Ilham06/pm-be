import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateClientDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    representative: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    phone: string;

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    address: string;
}
