import { MigrationInterface, QueryRunner } from "typeorm";
export declare class UsersTable1717791764947 implements MigrationInterface {
  name: string;
  up(queryRunner: QueryRunner): Promise<void>;
  down(queryRunner: QueryRunner): Promise<void>;
}
