import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AuthProviderEnum } from '../../../enums/auth.enum';

@Injectable()
export class ProviderAuthPipe implements PipeTransform {
  /**
   * Transform the value to a valid auth provider
   * @param value {string} - The value to transform
   * @returns {string} - The transformed value
   */
  transform(value: string): string {
    if (!AuthProviderEnum[value]) {
      throw new BadRequestException(
        `auth provided '${value}' is not supported, must be: ${Object.keys(AuthProviderEnum)}`,
      );
    }

    return value;
  }
}
