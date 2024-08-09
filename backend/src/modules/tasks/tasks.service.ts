import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CourseService } from '../course/course.service';
import { CourseModel } from '../course/entities/course.entity';
import { join } from 'path';
import { existsSync, rmSync } from 'fs';

@Injectable()
export class TasksService {
  readonly logger = new Logger(TasksService.name);

  constructor(private readonly courseService: CourseService) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async archiveCourses() {
    this.logger.warn('Starting to look for courses to archive');

    const courses = await this.courseService.getAndArchiveCourses();

    this.logger.warn(`Archived ${courses.length} courses`);

    if (courses.length == 0) return;

    await this.deleteExamsFoldersByPath(courses);

    this.logger.warn('Finished looking for courses to archive');
  }

  /**
   * Deletes the exams folders for the given courses.
   * @param courses {CourseModel[]} The courses whose exams folders should be deleted.
   * @returns {Promise<void>} A promise that resolves when the exams folders have been deleted.
   */
  private async deleteExamsFoldersByPath(
    courses: CourseModel[],
  ): Promise<void> {
    for (const course of courses) {
      this.logger.warn(`Deleting exams folders for course ${course.id}`);

      for (const exam of course.exams) {
        const filePath = join(
          __dirname,
          '..',
          '..',
          '..',
          '..',
          'uploads',
          'exams',
          'processed_submissions',
          exam.exam_folder,
        );

        if (existsSync(filePath)) {
          rmSync(filePath, { recursive: true });
          this.logger.warn(`Deleted exam folder ${exam.exam_folder}`);
        }
      }
    }
  }
}
