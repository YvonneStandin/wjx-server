import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  // 依赖注入
  constructor(private readonly UserService: UserService) {}

  // 校验用户
  async signIn(username: string, password: string) {
    const user = await this.UserService.findOne(username, password);

    if (!user) {
      throw new UnauthorizedException('用户或密码错误');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...userInfo } = user.toObject();

    return userInfo; // 不返回 password 字段
  }
}
