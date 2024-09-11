import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStatusTableArea1720706305007 implements MigrationInterface {
  name = 'AddStatusTableArea1720706305007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`area\` ADD \`status\` tinyint NOT NULL DEFAULT 1`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`area\` DROP COLUMN \`status\``);
  }
}
