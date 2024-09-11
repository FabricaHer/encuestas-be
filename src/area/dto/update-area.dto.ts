import { OmitType, PartialType, PickType } from '@nestjs/mapped-types';
import { Area } from '../entities/area.entity';

export class UpdateAreaDto extends PartialType(
  PickType(Area, ['description', 'status']),
) {}
