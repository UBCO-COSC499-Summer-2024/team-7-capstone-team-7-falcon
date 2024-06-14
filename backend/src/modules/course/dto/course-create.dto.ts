import { IsNumber, IsString, MinLength } from 'class-validator';

export class CourseCreateDto {
  @IsString()
  @MinLength(2)
  course_code: string;

  @IsString()
  course_name: string;

  @IsString()
  section_name: string;

  @IsNumber()
  semester_id: number;
}
