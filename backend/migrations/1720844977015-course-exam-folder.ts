import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseExamFolder1720844977015 implements MigrationInterface {
  name = 'CourseExamFolder1720844977015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_model" ADD "exam_folder" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_model" DROP COLUMN "exam_folder"`,
    );
  }
}
