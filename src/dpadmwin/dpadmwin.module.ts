import { Module } from '@nestjs/common';
import { DpadmwinService } from './services/dpadmwin.service';
import { DpadmwinController } from './controllers/dpadmwin.controller';

@Module({
  controllers: [DpadmwinController],
  providers: [DpadmwinService],
})
export class DpadmwinModule {}
