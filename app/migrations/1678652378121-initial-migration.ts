import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1678652378121 implements MigrationInterface {
    name = 'InitialMigration1678652378121';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Define SQL statements for table creation and initial data seeding.
        await queryRunner.query(`
            CREATE TABLE users (
                id INT PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(255) NOT NULL
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert the changes made in the `up` method, e.g., drop the created table.
        await queryRunner.query(`
            DROP TABLE users;
        `);
    }
}