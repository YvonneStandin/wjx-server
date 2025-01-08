import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;

    return await this.AuthService.signIn(username, password);
  }
}
