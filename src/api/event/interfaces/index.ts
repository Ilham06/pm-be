import { CreateEventDto } from "../dto/create-event.dto";

export interface CreateEventInterface {
   data: CreateEventDto;
   buffer: Buffer;
   file: Express.Multer.File;
   userId: string;
 }

 export interface UpdateEventInterface {
   id: string;
   data: CreateEventDto;
   buffer?: Buffer;
   file?: Express.Multer.File;
   userId: string;
 }

 export interface ChangeStatusInterface {
   id: string;
   status: number;
   note?: string;
 }

 export interface UploadEventDocumentInterface {
  id: string;
  file: Express.Multer.File;
  type: string;
  userId: string;
}
 