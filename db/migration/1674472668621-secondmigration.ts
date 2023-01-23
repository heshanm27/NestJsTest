import { MigrationInterface, QueryRunner } from "typeorm";

export class secondmigration1674472668621 implements MigrationInterface {
    name = 'secondmigration1674472668621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ff800d1b5262cfbd4eac31c607a\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`authorIdId\` \`authorIdId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ff800d1b5262cfbd4eac31c607a\` FOREIGN KEY (\`authorIdId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`posts\` DROP FOREIGN KEY \`FK_ff800d1b5262cfbd4eac31c607a\``);
        await queryRunner.query(`ALTER TABLE \`posts\` CHANGE \`authorIdId\` \`authorIdId\` varchar(36) NULL DEFAULT 'NULL'`);
        await queryRunner.query(`ALTER TABLE \`posts\` ADD CONSTRAINT \`FK_ff800d1b5262cfbd4eac31c607a\` FOREIGN KEY (\`authorIdId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
