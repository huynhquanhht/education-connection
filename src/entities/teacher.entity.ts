import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teachers')
export class Teacher {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id?: number;

  @Column({
    name: 'email',
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
  })
  email: string;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.teacher)
  public students?: Student[];
}
