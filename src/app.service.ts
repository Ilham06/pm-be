import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World, Ini test perubahan kelima, spesific branch!';
  }
}
