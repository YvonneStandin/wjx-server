import {
  Controller,
  Post,
  Get,
  Body,
  Request,
  //   UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
// import { AuthGuard } from './auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly AuthService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() userInfo: CreateUserDto) {
    const { username, password } = userInfo;

    return await this.AuthService.signIn(username, password);
  }

  //   @UseGuards(AuthGuard) // 放在路由前先解密，并将user信息放在了 request 中
  @Get('profile')
  async getProfile(@Request() req) {
    return req.user;
  }
}
