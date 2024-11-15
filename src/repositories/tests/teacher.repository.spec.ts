import { Test, TestingModule } from '@nestjs/testing';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { DataSource, In } from 'typeorm';
import { Teacher } from '@/entities/teacher.entity';

describe('TeacherRepository', () => {
  let teacherRepository: TeacherRepository;
  let dataSource: DataSource;

  const mockFindOne = jest.fn();
  const mockFind = jest.fn();

  const mockDataSource = {
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

  describe('getByEmail', () => {
    it('should return a teacher by email', async () => {
      const teacherEmail = 'teacher@example.com';
      const teacher: Teacher = { email: teacherEmail } as Teacher;

      // Mock the return value of findOne
      mockFindOne.mockResolvedValue(teacher);
      teacherRepository.findOne = mockFindOne;

      const result = await teacherRepository.getByEmail(teacherEmail);

      expect(mockFindOne).toHaveBeenCalledWith({ where: { email: teacherEmail } });
      expect(result).toEqual(teacher);
    });

    it('should throw an error if teacher not found', async () => {
      const teacherEmail = 'teacher@example.com';

      // Mock the return value of findOne to be undefined (no teacher found)
      mockFindOne.mockResolvedValue(undefined);
      teacherRepository.findOne = mockFindOne;

      await expect(teacherRepository.getByEmail(teacherEmail)).resolves.toBe(undefined);
    });
  });

  describe('getByEmails', () => {
    it('should return a list of teachers by their emails', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const teachers: Teacher[] = [
        { email: teacherEmails[0] } as Teacher,
        { email: teacherEmails[1] } as Teacher,
      ];

      // Mock the return value of find
      mockFind.mockResolvedValue(teachers);
      teacherRepository.find = mockFind;

      const result = await teacherRepository.getByEmails(teacherEmails);

      expect(mockFind).toHaveBeenCalledWith({ where: { email: In(teacherEmails) } });
      expect(result).toEqual(teachers);
    });

    it('should return an empty array if no teachers found', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];

      // Mock the return value of find to be an empty array
      mockFind.mockResolvedValue([]);
      teacherRepository.find = mockFind;

      const result = await teacherRepository.getByEmails(teacherEmails);

      expect(mockFind).toHaveBeenCalledWith({ where: { email: In(teacherEmails) } });
      expect(result).toEqual([]);
    });
  });
});
