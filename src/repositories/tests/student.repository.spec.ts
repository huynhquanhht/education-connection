import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, In } from 'typeorm';
import { StudentRepository } from '@/repositories/student.repository';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';

describe('StudentRepository', () => {
  let studentRepository: StudentRepository;
  let dataSource: DataSource;

  const mockCreateQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
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

      mockCreateQueryBuilder.execute.mockResolvedValue(students);

      const result = await studentRepository.getCommonStudents(teachers);

      expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith('*');
      expect(mockCreateQueryBuilder.from).toHaveBeenCalledWith(Student, 's');
      expect(mockCreateQueryBuilder.innerJoin).toHaveBeenCalled();
      expect(mockCreateQueryBuilder.execute).toHaveBeenCalled();
      expect(result).toEqual(students);
    });

    describe('getByEmail', () => {
      it('should call findOne with the correct email', async () => {
        const email = 'test@example.com';
        const expectedResult = { id: 1, email };

        studentRepository.findOne = jest.fn().mockResolvedValue(expectedResult);

        const result = await studentRepository.getByEmail(email);

        expect(studentRepository.findOne).toHaveBeenCalledWith({
          where: { email },
        });
        expect(result).toEqual(expectedResult);
      });
    });

    describe('getByEmails', () => {
      it('should return a list of students by their emails', async () => {
        const studentEmails = ['student1@example.com', 'student2@example.com'];
        const students: Student[] = [
          { email: studentEmails[0] } as Student,
          { email: studentEmails[1] } as Student,
        ];

        studentRepository.findBy = jest.fn().mockResolvedValue(students);

        const result = await studentRepository.getByEmails(studentEmails);

        expect(studentRepository.findBy).toHaveBeenCalledWith({
          email: In(studentEmails),
        });
        expect(result).toEqual(students);
      });
    });

    describe('suspendStudent', () => {
      it('should suspend a student', async () => {
        const mockStudent = {
          id: 1,
          email: 'test@example.com',
          isSuspended: true,
        };

        mockCreateQueryBuilder.execute.mockResolvedValue(1);

        await studentRepository.suspendStudent(mockStudent);

        expect(mockCreateQueryBuilder.update).toHaveBeenCalledTimes(1);
        expect(mockCreateQueryBuilder.execute).toHaveBeenCalledTimes(1);
        expect(mockCreateQueryBuilder.set).toHaveBeenCalledWith({
          isSuspended: true,
        });
      });
    });

    describe('retrieveForNotifications', () => {
      it('should return a list of students sent notifications', async () => {
        const mentionedStudents = [
          'student1@example.com',
          'student2@example.com',
        ];
        const teacherId = 1;

        const students: Student[] = [
          { email: mentionedStudents[0] } as Student,
          { email: mentionedStudents[1] } as Student,
        ];

        mockCreateQueryBuilder.getMany.mockResolvedValue(students);

        const result = await studentRepository.retrieveForNotifications(
          teacherId,
          mentionedStudents,
        );

        expect(result).toEqual(students);
        expect(mockCreateQueryBuilder.select).toHaveBeenCalledWith([
          's.id',
          's.email',
        ]);
        expect(mockCreateQueryBuilder.from).toHaveBeenCalledWith(Student, 's');
        expect(mockCreateQueryBuilder.leftJoin).toHaveBeenCalledWith(
          'teacher_student',
          'ts',
          'ts.student_id = s.id',
        );
        expect(mockCreateQueryBuilder.where).toHaveBeenCalledWith(
          's.is_suspended is false',
        );
        expect(mockCreateQueryBuilder.andWhere).toHaveBeenCalledWith(
          '(s.email in (:...emails) OR ts.teacher_id = :teacherId )',
          {
            emails: [mentionedStudents],
            teacherId: teacherId,
          },
        );
        expect(mockCreateQueryBuilder.getMany).toHaveBeenCalledTimes(1);
      });
    });
  });
});
