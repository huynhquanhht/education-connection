import { Faker } from '@faker-js/faker';
import { SeederFactoryItem, setSeederFactory } from 'typeorm-extension';
import { Student } from '@/entities/student.entity';

export const StudentFactory: SeederFactoryItem = setSeederFactory(
  Student,
  (faker: Faker) => {
    const student: Student = new Student();
    student.email = faker.internet.email();
    student.isSuspended =  !!faker.number;

    return student;
  },
);