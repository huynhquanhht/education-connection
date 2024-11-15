import { Faker } from '@faker-js/faker';
import { SeederFactoryItem, setSeederFactory } from 'typeorm-extension';
import { Teacher } from '@/entities/teacher.entity';

export const TeacherFactory: SeederFactoryItem = setSeederFactory(
  Teacher,
  (faker: Faker) => {
    const teacher: Teacher = new Teacher();
    teacher.email = faker.internet.email();

    return teacher;
  },
);