import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAdmissionColumnInTableAnswerPatient1723047127723
  implements MigrationInterface
{
  name = 'AddAdmissionColumnInTableAnswerPatient1723047127723';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP COLUMN \`bedId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP COLUMN \`patientId\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD \`bed_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD \`patient_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD \`admission_id\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD UNIQUE INDEX \`IDX_27252898ccb5c598cb64549560\` (\`admission_id\`)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP INDEX \`IDX_27252898ccb5c598cb64549560\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP COLUMN \`admission_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP COLUMN \`patient_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` DROP COLUMN \`bed_id\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD \`patientId\` varchar(255) NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`answer_patient\` ADD \`bedId\` varchar(255) NOT NULL`,
    );
  }
}
