import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Student } from './student.entity';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teachers')
export class Teacher {
	@PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
	id?: number;

	@Column('varchar', { name: 'email', nullable: false, length: 255, unique: true })
	email: string;

	@OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.teacher)
	public students?: Student[];
}
