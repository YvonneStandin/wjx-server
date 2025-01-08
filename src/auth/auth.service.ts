import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  // 依赖注入
  constructor(
    private readonly UserService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  // 校验用户
  async signIn(username: string, password: string): Promise<{ token: string }> {
    const user = await this.UserService.findOne(username, password);

    if (!user) {
      throw new UnauthorizedException('用户或密码错误');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: p, ...userInfo } = user.toObject(); // 不返回 password 字段

    return {
      token: await this.jwtService.signAsync(userInfo),
    };
  }
}
