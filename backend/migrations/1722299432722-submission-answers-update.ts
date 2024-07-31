import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubmissionAnswersUpdate1722299432722
  implements MigrationInterface
{
  name = 'SubmissionAnswersUpdate1722299432722';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_model" ALTER COLUMN "answers" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ALTER COLUMN "answers" SET DEFAULT '{}'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_model" ALTER COLUMN "answers" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ALTER COLUMN "answers" SET NOT NULL`,
    );
  }
}
