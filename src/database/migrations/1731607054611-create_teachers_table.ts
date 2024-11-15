import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeachersTable1731607054611 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'teachers',
				columns: [
					{
						name: 'id',
						type: 'int',
						isPrimary: true,
						isGenerated: true,
						generationStrategy: 'increment',
						isNullable: false,
					},
					{
						name: 'email',
						type: 'varchar',
						isUnique: true,
						length: '255',
					},
				],
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('teachers');
	}
}
