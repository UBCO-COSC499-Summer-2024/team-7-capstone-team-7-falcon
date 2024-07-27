import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ async: false })
class Is2DNumberArrayConstraint implements ValidatorConstraintInterface {
  /**
   * Validate if the value is a 2D array of numbers
   * @param value {any} Value to validate
   * @param _args {ValidationArguments} Validation arguments
   * @returns {boolean} Boolean indicating if the value is a 2D array of numbers
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, _args: ValidationArguments): boolean {
    if (!Array.isArray(value)) return false;

    return value.every(
      (arr: any) =>
        Array.isArray(arr) && arr.every((num) => typeof num === 'number'),
    );
  }
}

/**
 * Decorator to validate if the value is a 2D array of numbers
 * @param validationOptions {ValidationOptions} Options for the validation
 */
export function Is2DNumberArray(validationOptions?: ValidationOptions) {
  /**
   * Decorator to validate if the value is a 2D array of numbers
   */
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
