import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';

describe('TeacherService', () => {
  let service: TeacherService;
  let teacherRepository: TeacherRepository;
  let studentRepository: StudentRepository;
  let teacherStudentRepository: TeacherStudentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherService,
        {
          provide: TeacherRepository,
          useValue: {
            getByEmail: jest.fn(),
            getByEmails: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            getByEmails: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            retrieveForNotifications: jest.fn(),
          },
        },
        {
          provide: TeacherStudentRepository,
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    studentRepository = module.get<StudentRepository>(StudentRepository);
    teacherStudentRepository = module.get<TeacherStudentRepository>(TeacherStudentRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
