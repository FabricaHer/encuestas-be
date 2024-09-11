import { OmitType, PartialType } from '@nestjs/mapped-types';
import { Format } from '../entities/format.entity';

export class UpdateFormatDto extends PartialType(
  OmitType(Format, ['createdAt', 'updatedAt', 'deletedAt', 'id']),
) {}
