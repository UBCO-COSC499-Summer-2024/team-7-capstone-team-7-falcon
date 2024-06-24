import { MigrationInterface, QueryRunner } from 'typeorm';

export class TokenUserModel1719091246676 implements MigrationInterface {
  name = 'TokenUserModel1719091246676';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "token_model" ("id" SERIAL NOT NULL, "token" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL DEFAULT 'EMAIL_VERIFICATION', "created_at" bigint NOT NULL, "expires_at" bigint NOT NULL, "user_id" integer, CONSTRAINT "PK_ac681cff68d935028db05c95bf8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "token_model" ADD CONSTRAINT "FK_7c41b3dbd8f3b9a689f2c095d02" FOREIGN KEY ("user_id") REFERENCES "user_model"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "token_model" DROP CONSTRAINT "FK_7c41b3dbd8f3b9a689f2c095d02"`,
    );
    await queryRunner.query(`DROP TABLE "token_model"`);
  }
}
