import { Injectable } from '@nestjs/common';
import {
  isUUID,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { FormatService } from '../services/format.service';

@ValidatorConstraint({
  async: true,
})
@Injectable()
export class IsFormatValidConstraint implements ValidatorConstraintInterface {
  constructor(private formatService: FormatService) {}
  async validate(value: string): Promise<boolean> {
    if (!value) return false;
    const format = await this.formatService.exists(parseInt(value));
    return Boolean(format);
  }
  defaultMessage?(): string {
    return 'Formato no encontrado';
  }
}
