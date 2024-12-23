import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';

@Entity('students')
export class Student {
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

  @Column({ name: 'is_suspended', type: 'tinyint' })
  isSuspended: boolean;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  public teachers?: Teacher[];

  constructor() {}
}
