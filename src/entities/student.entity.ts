import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';

@Entity('students')
export class Student {
	@PrimaryGeneratedColumn('increment', { name: 'id', type: 'int' })
	id?: number;

	@Column('varchar', { name: 'email', nullable: false, length: 255, unique: true })
	email: string;

	@Column({ name: 'is_suspended', type: 'tinyint' })
	isSuspended: boolean;

	@OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
	public teachers?: Teacher[];

	constructor() {}
}
