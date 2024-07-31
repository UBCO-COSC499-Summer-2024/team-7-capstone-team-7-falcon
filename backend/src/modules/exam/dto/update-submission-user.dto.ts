import { IsNumber, Min } from 'class-validator';

export class UpdateSubmissionUserDto {
  @IsNumber()
  @Min(1)
  studentId!: number;
}
