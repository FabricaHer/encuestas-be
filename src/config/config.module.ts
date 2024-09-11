import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from './';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
  ],

  exports: [ConfigModule],
})
export class configModule {}