import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserModel1717659360988 implements MigrationInterface {
  name = 'UserModel1717659360988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "student_user_model" ("id" SERIAL NOT NULL, "student_id" integer, CONSTRAINT "PK_fdb5606af700450b39046da0a8d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_model" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'student', "created_at" integer NOT NULL, "updated_at" integer NOT NULL, "auth_type" character varying NOT NULL DEFAULT 'email', "email" character varying NOT NULL, "password" character varying, "employee_id" integer, "student_id" integer, CONSTRAINT "UQ_864bd044bba869304084843358e" UNIQUE ("email"), CONSTRAINT "REL_8bdc425f51d5f9d7aad336e9e5" UNIQUE ("employee_id"), CONSTRAINT "REL_52224dbbbe33bf2baf847b04f7" UNIQUE ("student_id"), CONSTRAINT "PK_7d6bfa71f4d6a1fa0af1f688327" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "employee_user_model" ("id" SERIAL NOT NULL, "employee_id" integer, CONSTRAINT "PK_1b2d2b016e8a99c17d3a7d0a22d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_model" ADD CONSTRAINT "FK_8bdc425f51d5f9d7aad336e9e5a" FOREIGN KEY ("employee_id") REFERENCES "employee_user_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "user_model" DROP CONSTRAINT "FK_8bdc425f51d5f9d7aad336e9e5a"`,
    );
    await queryRunner.query(`DROP TABLE "employee_user_model"`);
    await queryRunner.query(`DROP TABLE "user_model"`);
    await queryRunner.query(`DROP TABLE "student_user_model"`);
  }
}
