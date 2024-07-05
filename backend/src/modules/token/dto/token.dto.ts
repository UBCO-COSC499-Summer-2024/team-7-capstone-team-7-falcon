import { IsString, MinLength } from 'class-validator';

export class TokenDto {
  @IsString()
  @MinLength(5)
  token!: string;
}
