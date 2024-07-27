import { IsString, MinLength } from 'class-validator';

export class DisputeSubmissionDto {
  @IsString()
  @MinLength(1)
  description!: string;
}
