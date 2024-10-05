import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserController } from './user.controller';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule],
  controllers: [UserController]
})
export class UserModule {}
