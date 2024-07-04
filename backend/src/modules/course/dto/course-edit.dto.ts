import { IsNumber, IsString, MinLength } from 'class-validator';

export class CourseEditDto {
  @IsString()
  @MinLength(2)
  courseCode!: string;

  @IsString()
  courseName!: string;

  @IsNumber()
  semesterId!: number;

  @IsString()
  @MinLength(5)
  inviteCode!: string;
}
