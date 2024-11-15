import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { StudentRepository } from '@/repositories/student.repository';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';

describe('StudentRepository', () => {
  let studentRepository: StudentRepository;
  let dataSource: DataSource;

  const mockCreateQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    leftJoin: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    groupBy: jest.fn().mockReturnThis(),
    having: jest.fn().mockReturnThis(),
    execute: jest.fn(),
    getMany: jest.fn(),
  };

  const mockDataSource = {
    createQueryBuilder: jest.fn().mockReturnValue(mockCreateQueryBuilder),
    createEntityManager: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    studentRepository = module.get<StudentRepository>(StudentRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCommonStudents', () => {
    it('should return a list of common students among the given teachers', async () => {
      const teachers = [{ id: 1 }, { id: 2 }] as Teacher[];
      const students = [{ id: 1, email: 'student@example.com' }] as Student[];

      // Set the execute function to resolve with our mock data
      mockCreateQueryBuilder.execute.mockResolvedValue(students);

      const result = await studentRepository.getCommonStudents(teachers);

      // Verify the query building steps
      expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockCreateQueryBuilder.from).toHaveBeenCalledWith(Student, 's');
      expect(mockCreateQueryBuilder.innerJoin).toHaveBeenCalled();
      expect(mockCreateQueryBuilder.execute).toHaveBeenCalled();
      expect(result).toEqual(students);
    });
  });
});
