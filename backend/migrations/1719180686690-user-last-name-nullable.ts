import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserLastNameNullable1719180686690 implements MigrationInterface {
  name = 'UserLastNameNullable1719180686690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" ALTER COLUMN "last_name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" ALTER COLUMN "last_name" SET NOT NULL`,
    );
  }
}
