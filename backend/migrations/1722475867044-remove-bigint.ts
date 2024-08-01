import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveBigint1722475867044 implements MigrationInterface {
    name = 'RemoveBigint1722475867044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_user_model" DROP COLUMN "student_id"`);
        await queryRunner.query(`ALTER TABLE "student_user_model" ADD "student_id" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "student_user_model" DROP COLUMN "student_id"`);
        await queryRunner.query(`ALTER TABLE "student_user_model" ADD "student_id" bigint NOT NULL`);
    }

}
