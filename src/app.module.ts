import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { RoleModule } from './api/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './api/user/user.service';
import { ResponseInterceptor } from './core/interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClientModule } from './api/client/client.module';
import { BankService } from './api/bank/bank.service';
import { BankModule } from './api/bank/bank.module';

@Module({
  imports: [AuthModule, RoleModule, PrismaModule, ClientModule, BankModule],
  controllers: [AppController],
  providers: [AppService, UsersService, {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  }, BankService,],
})
export class AppModule {}
