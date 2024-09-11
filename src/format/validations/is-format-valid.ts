import { registerDecorator, ValidationOptions } from 'class-validator';

import { IsFormatValidConstraint } from './is-format-valid.constraint';

export function IsFormatValid(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsFormatValidConstraint,
    });
  };
}
