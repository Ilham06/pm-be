import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './api/auth/auth.module';
import { RoleModule } from './api/role/role.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersService } from './api/user/user.service';
import { ResponseInterceptor } from './core/interceptors';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [AuthModule, RoleModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService, UsersService, {
    provide: APP_INTERCEPTOR,
    useClass: ResponseInterceptor,
  },],
})
export class AppModule {}
