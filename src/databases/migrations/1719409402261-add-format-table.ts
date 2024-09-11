import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFormatTable1719409402261 implements MigrationInterface {
    name = 'AddFormatTable1719409402261'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`format\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`status\` tinyint NOT NULL DEFAULT 1, \`bed_id\` varchar(255) NOT NULL, \`is_for_all\` tinyint NOT NULL DEFAULT 0, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` timestamp(6) NULL, UNIQUE INDEX \`IDX_4d63df90f21850eff3f5773f16\` (\`name\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_4d63df90f21850eff3f5773f16\` ON \`format\``);
        await queryRunner.query(`DROP TABLE \`format\``);
    }

}
