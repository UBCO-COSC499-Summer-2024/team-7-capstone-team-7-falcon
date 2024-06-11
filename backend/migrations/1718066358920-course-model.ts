import { MigrationInterface, QueryRunner } from 'typeorm';

export class CourseModel1718066358920 implements MigrationInterface {
  name = 'CourseModel1718066358920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "course_user_model" ("id" SERIAL NOT NULL, "course_role" character varying NOT NULL DEFAULT 'student', "user_id" integer, "course_id" integer, CONSTRAINT "PK_ff8232526104b63c437168b1836" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "course_model" ("id" SERIAL NOT NULL, "course_code" character varying NOT NULL, "course_name" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "is_archived" boolean NOT NULL DEFAULT false, "invite_code" character varying NOT NULL, "section_name" character varying NOT NULL, CONSTRAINT "PK_78f12196238e8ce83a249b05af2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "exam_model" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "exam_date" bigint NOT NULL, "grades_released_at" bigint NOT NULL, "questions" json NOT NULL, "course_id" integer, CONSTRAINT "PK_db36e8185c6c44e2f472de2f025" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "submission_model" ("id" SERIAL NOT NULL, "document_path" character varying NOT NULL, "score" double precision NOT NULL, "created_at" bigint NOT NULL, "updated_at" bigint NOT NULL, "answers" json NOT NULL, "exam_id" integer, "student_id" integer, CONSTRAINT "PK_fb4ca605822d95b6c9f74e23698" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_user_model" ADD CONSTRAINT "FK_a614d3fe8d242ff0b11a83a1e3d" FOREIGN KEY ("user_id") REFERENCES "user_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_user_model" ADD CONSTRAINT "FK_a8510d92b5b304fc3750d826ce0" FOREIGN KEY ("course_id") REFERENCES "course_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_model" ADD CONSTRAINT "FK_db85e67abacf03ec18add2deffd" FOREIGN KEY ("course_id") REFERENCES "course_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "FK_7f965c8a9c0931a5a632948509e" FOREIGN KEY ("exam_id") REFERENCES "exam_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "FK_f657a669fd80f603452c9da4c63" FOREIGN KEY ("student_id") REFERENCES "student_user_model"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "FK_f657a669fd80f603452c9da4c63"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "FK_7f965c8a9c0931a5a632948509e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "exam_model" DROP CONSTRAINT "FK_db85e67abacf03ec18add2deffd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_user_model" DROP CONSTRAINT "FK_a8510d92b5b304fc3750d826ce0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "course_user_model" DROP CONSTRAINT "FK_a614d3fe8d242ff0b11a83a1e3d"`,
    );
    await queryRunner.query(`DROP TABLE "submission_model"`);
    await queryRunner.query(`DROP TABLE "exam_model"`);
    await queryRunner.query(`DROP TABLE "course_model"`);
    await queryRunner.query(`DROP TABLE "course_user_model"`);
  }
}
