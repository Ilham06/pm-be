import { CreateFinanceDto } from "../dto/create-finance.dto";
import { UpdateFinanceDto } from "../dto/update-finance.dto";

export interface CreateTransactionInterface {
   userId: string;
   data: CreateFinanceDto;
   file: Express.Multer.File;
   buffer: Buffer
}

export interface UpdateTransactionInterface {
   id: string;
   data: UpdateFinanceDto;
   file: Express.Multer.File;
}

export interface ChangeStatusInterface {
   id: string;
   status: number;
   note?: string;
 }