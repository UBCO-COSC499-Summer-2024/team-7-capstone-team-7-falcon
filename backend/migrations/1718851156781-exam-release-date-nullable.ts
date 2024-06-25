import { MigrationInterface, QueryRunner } from 'typeorm';

export class ExamReleaseDateNullable1718851156781
  implements MigrationInterface
{
  name = 'ExamReleaseDateNullable1718851156781';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_model" ALTER COLUMN "grades_released_at" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "exam_model" ALTER COLUMN "grades_released_at" SET NOT NULL`,
    );
  }
}
