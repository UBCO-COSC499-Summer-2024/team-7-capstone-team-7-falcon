import { IsBoolean } from 'class-validator';

export class CourseArchiveDto {
  @IsBoolean()
  archive!: boolean;
}
