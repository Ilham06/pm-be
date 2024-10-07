import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService],
  imports: [PrismaModule],
})
export class ClientModule {}
