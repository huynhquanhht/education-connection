import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
  id?: number;

  @Column('varchar', {
    name: 'email',
    nullable: false,
    length: 255,
    unique: true,
  })
  email: string;

  @Column({ name: 'password', type: 'varchar', nullable: false })
  password?: string;

  @Column({ name: 'access_token', type: 'varchar', nullable: true })
  token?: string;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.teacher)
  public students?: Student[];
}
