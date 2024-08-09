import { MigrationInterface, QueryRunner } from 'typeorm';

export class SubmissionDispute1721696260923 implements MigrationInterface {
  name = 'SubmissionDispute1721696260923';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "submission_dispute_model" ("id" SERIAL NOT NULL, "description" character varying NOT NULL, "created_at" bigint, "updated_at" bigint, "resolved_at" bigint, "status" character varying DEFAULT 'CREATED', CONSTRAINT "PK_30a1a8d698e552e7a02880772c0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD "dispute_id" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "UQ_435b76d5943f8d0646d0fa71a06" UNIQUE ("dispute_id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" ADD CONSTRAINT "FK_435b76d5943f8d0646d0fa71a06" FOREIGN KEY ("dispute_id") REFERENCES "submission_dispute_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "FK_435b76d5943f8d0646d0fa71a06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP CONSTRAINT "UQ_435b76d5943f8d0646d0fa71a06"`,
    );
    await queryRunner.query(
      `ALTER TABLE "submission_model" DROP COLUMN "dispute_id"`,
    );
    await queryRunner.query(`DROP TABLE "submission_dispute_model"`);
  }
}
