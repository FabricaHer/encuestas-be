import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DpadmwinService } from '../../dpadmwin/services/dpadmwin.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly dpadmwinService: DpadmwinService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.dpadmwinService.getUser(username);

    if (user.password != password) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username, role: user.role };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
