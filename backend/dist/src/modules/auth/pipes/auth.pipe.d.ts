import { PipeTransform } from "@nestjs/common";
export declare class ProviderAuthPipe implements PipeTransform {
  transform(value: string): string;
}
