import { Module } from '@nestjs/common';
import { FormatService } from './services/format.service';
import { FormatController } from './controllers/format.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Format } from './entities/format.entity';
import { IsFormatValidConstraint } from './validations/is-format-valid.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Format])],
  controllers: [FormatController],
  providers: [FormatService, IsFormatValidConstraint],
  exports: [FormatService, IsFormatValidConstraint],
})
export class FormatModule {}
