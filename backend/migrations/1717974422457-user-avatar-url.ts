import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAvatarUrl1717974422457 implements MigrationInterface {
  name = 'UserAvatarUrl1717974422457';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" ADD "avatar_url" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_model" DROP COLUMN "avatar_url"`,
    );
  }
}
