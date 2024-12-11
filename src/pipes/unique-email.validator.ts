import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'IsUnique' })
export class IsUnique implements ValidatorConstraintInterface {
  validate(
    values: Array<any>,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    if (!Array.isArray(values)) return true;
    return values.length <= (new Set(values)).size;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} must not be unique.`
  }
}
