import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class CodeAuthPipe implements PipeTransform {
  /**
   * Validates the code value
   * @param value {string} - The value to transform
   * @returns {string} - The transformed value
   */
  transform(value: string): string {
    if (!value) {
      throw new BadRequestException(`code is required`);
    }
    return value;
  }
}
