import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import config from '../config';
import { DpadmwinModule } from '../dpadmwin/dpadmwin.module';
import { AuthController } from './controllers/auth.controller';
import { AuthGuard } from './guard/auth.guard';
import { AuthService } from './services/auth.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { secret } = configService.jwt;

        return {
          secret,
          global: true,
          signOptions: { expiresIn: '12h' },
        };
      },
    }),
    DpadmwinModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
