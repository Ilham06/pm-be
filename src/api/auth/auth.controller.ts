import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
   constructor(private authService: AuthService) {}

   @HttpCode(HttpStatus.OK)
   @Post('login')
   signIn(@Body() data: LoginDto) {
      return this.authService.signIn(data)
   }

   @HttpCode(HttpStatus.OK)
   @Post('register')
   register(@Body() data: CreateUserDto) {
      
      return this.authService.register(data)
    }

   // @UseGuards(AuthGuard)
   @Get('profile')
   getProfile(@Body() req) {
      return req;
   }
}
