import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule],
  controllers: [UserController]
})
export class UserModule {}
