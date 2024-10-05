import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService,  private jwtService: JwtService) {}

  async signIn(data: LoginDto): Promise<any> {
    let user = await this.usersService.findOne(data.email);
    if (!user) {
      throw new NotFoundException('User Not Found');
    }

    const isMatch = await bcrypt.compare(data.password, user.password)
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    
    const payload = { sub: user.id, username: user.name };
    user['access_token'] = await this.jwtService.signAsync(payload)
    
    return {
      user
    };
  }

  async register(data: CreateUserDto): Promise<User> {
    return this.usersService.create(data)
  }
}
