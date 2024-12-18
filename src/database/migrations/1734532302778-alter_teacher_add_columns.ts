import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AlterTeacherAddPassword1734532302778
  implements MigrationInterface
{
  name = 'AlterTeacherAddPassword1734532302778';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('teachers', new TableColumn({
      name: 'password',
      type: 'varchar',
      isNullable: false
    }));
    await queryRunner.addColumn('teachers', new TableColumn({
      name: 'access_token',
      type: 'varchar',
      isNullable: true
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('teachers', 'password');
    await queryRunner.dropColumn('teachers', 'access_token');
  }
}
