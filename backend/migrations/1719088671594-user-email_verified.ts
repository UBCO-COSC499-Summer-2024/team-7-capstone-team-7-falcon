import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserEmailVerified1719088671594 implements MigrationInterface {
  name = 'UserEmailVerified1719088671594';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" ADD "email_verified" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" DROP COLUMN "email_verified"`,
    );
  }
}
