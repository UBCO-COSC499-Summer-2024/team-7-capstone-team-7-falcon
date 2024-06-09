import { PipeTransform } from "@nestjs/common";
export declare class CodeAuthPipe implements PipeTransform {
  transform(value: string): string;
}
