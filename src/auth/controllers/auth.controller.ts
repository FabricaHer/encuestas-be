import { Body, Controller, HttpCode, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { Public } from '../decorators/public.decorator';
import { AuthLogInDTO } from '../dto/authLogin.dto';
import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @HttpCode(200)
  @Post()
  async login(@Body() authLoginDto: AuthLogInDTO, @Res() res: Response) {
    const { access_token } = await this.authService.logIn(
      authLoginDto.username,
      authLoginDto.password,
    );

    res.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      expires: new Date(Date.now() + 1000 * 60 * 60 * 12), // 12 hours
    });

    res.status(200).send({ access_token });
  }
}
