import { MigrationInterface, QueryRunner } from 'typeorm';

export class SemesterModel1718067439572 implements MigrationInterface {
  name = 'SemesterModel1718067439572';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "semester_model" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "starts_at" bigint NOT NULL, "ends_at" bigint NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, CONSTRAINT "PK_1a6198e89d15dc319132ce57b1c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_model" ADD "semesterId" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_model" ADD CONSTRAINT "FK_34820ed355fa20cb6037e9cab78" FOREIGN KEY ("semesterId") REFERENCES "semester_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "course_model" DROP CONSTRAINT "FK_34820ed355fa20cb6037e9cab78"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_model" DROP COLUMN "semesterId"`,
    );
    await queryRunner.query(`DROP TABLE "semester_model"`);
  }
}
