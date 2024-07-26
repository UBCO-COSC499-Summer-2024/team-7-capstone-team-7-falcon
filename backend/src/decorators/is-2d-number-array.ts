import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class Is2DNumberArrayConstraint implements ValidatorConstraintInterface {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, _args: ValidationArguments) {
    if (!Array.isArray(value)) return false;

    return value.every(
      (arr: any) =>
        Array.isArray(arr) && arr.every((num) => typeof num === 'number'),
    );
  }
}

export function Is2DNumberArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: Is2DNumberArrayConstraint,
    });
  };
}
