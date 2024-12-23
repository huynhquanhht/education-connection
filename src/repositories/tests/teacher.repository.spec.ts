import { Test, TestingModule } from '@nestjs/testing';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { DataSource } from 'typeorm';

describe('TeacherRepository', () => {
  let teacherRepository: TeacherRepository;
  let dataSource: DataSource;

  const mockDataSource = {
    createQueryBuilder: jest.fn(),
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeacherRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('TeacherRepository', () => {
    it('should be defined', () => {
      expect(teacherRepository).toBeDefined();
    });
  });
});
