import { MigrationInterface, QueryRunner } from 'typeorm';

export class AutoIncrementColumnStudentUserModel1718344210720
  implements MigrationInterface
{
  name = 'AutoIncrementColumnStudentUserModel1718344210720';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP CONSTRAINT "PK_956586c752a952c56b0274a5344"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD CONSTRAINT "PK_2b40790c543afa5a663547de09e" PRIMARY KEY ("student_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_model" DROP CONSTRAINT "FK_52224dbbbe33bf2baf847b04f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "FK_f657a669fd80f603452c9da4c63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP CONSTRAINT "PK_2b40790c543afa5a663547de09e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD CONSTRAINT "PK_fdb5606af700450b39046da0a8d" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP COLUMN "student_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD "student_id" bigint NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "FK_f657a669fd80f603452c9da4c63" FOREIGN KEY ("student_id") REFERENCES "student_user_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_model" ADD CONSTRAINT "FK_52224dbbbe33bf2baf847b04f71" FOREIGN KEY ("student_id") REFERENCES "student_user_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" DROP CONSTRAINT "FK_52224dbbbe33bf2baf847b04f71"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "FK_f657a669fd80f603452c9da4c63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP COLUMN "student_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD "student_id" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP CONSTRAINT "PK_fdb5606af700450b39046da0a8d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD CONSTRAINT "PK_2b40790c543afa5a663547de09e" PRIMARY KEY ("student_id", "id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "FK_f657a669fd80f603452c9da4c63" FOREIGN KEY ("student_id") REFERENCES "student_user_model"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_model" ADD CONSTRAINT "FK_52224dbbbe33bf2baf847b04f71" FOREIGN KEY ("student_id") REFERENCES "student_user_model"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP CONSTRAINT "PK_2b40790c543afa5a663547de09e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" ADD CONSTRAINT "PK_956586c752a952c56b0274a5344" PRIMARY KEY ("student_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "student_user_model" DROP COLUMN "id"`,
    );
  }
}
