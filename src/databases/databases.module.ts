import { Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from 'src/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        const { host, port, database, username, password } =
          configService.database;
        return {
          type: 'mariadb',
          host,
          port: parseInt(port),
          username,
          password,
          database,
          entities: [__dirname + '/../**/**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../**/**/*.migration{.ts,.js}'],
          subscribers: [__dirname + '/../**/**/*.subcriber{.ts,.js}'],
          synchronize: false,
          migrationsRun: true,
          // logging: true,
        };
      },
    }),
  ],
  providers: [],
  exports: [TypeOrmModule],
})
export class DatabasesModule {}
