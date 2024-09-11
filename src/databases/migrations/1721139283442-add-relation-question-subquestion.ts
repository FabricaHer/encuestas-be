import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationQuestionSubquestion1721139283442
  implements MigrationInterface
{
  name = 'AddRelationQuestionSubquestion1721139283442';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sub_question\` ADD \`question_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`sub_question\` ADD CONSTRAINT \`FK_b99e5c8c307b2454393a1c64bc7\` FOREIGN KEY (\`question_id\`) REFERENCES \`question\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`sub_question\` DROP FOREIGN KEY \`FK_b99e5c8c307b2454393a1c64bc7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`sub_question\` DROP COLUMN \`question_id\``,
    );
  }
}
