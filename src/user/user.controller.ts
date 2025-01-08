import {
  Controller,
  Post,
  Get,
  Body,
  HttpException,
  HttpStatus,
  Redirect,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly UserService: UserService) {}

  // 注册
  @Public()
  @Post('register')
  async register(@Body() userDto: CreateUserDto) {
    try {
      return await this.UserService.create(userDto);
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    }
  }

  // 获取用户信息
  @Get('info')
  @Redirect('/api/auth/profile', 302) // Get重定向 301永久 302临时
  async info() {
    return;
  }

  // 登录
  @Public()
  @Post('login')
  @Redirect('/api/auth/login', 307) // Post重定向 308永久 307临时
  async login() {
    return;
  }
}
