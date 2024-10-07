import { IsNotEmpty } from "class-validator";

export class CreateBankDto {
   @IsNotEmpty()
    bank: string;

    @IsNotEmpty()
    bank_number: string;

    @IsNotEmpty()
    bank_account: string
}
