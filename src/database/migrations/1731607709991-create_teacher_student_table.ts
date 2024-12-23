import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTeacherStudentTable1731607709991
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'teacher_student',
        columns: [
          {
            name: 'teacher_id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'student_id',
            type: 'int',
            isPrimary: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('teacher_student');
  }
}
