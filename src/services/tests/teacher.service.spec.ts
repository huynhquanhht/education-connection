import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from '@/services/teacher.service';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterStudentsRequestDto } from '@/dtos/request/register-students-request.dto';
import { SuspendStudentRequestDto } from '@/dtos/request/suspend-student-request.dto';
import { RetrieveNotificationsRequestDto } from '@/dtos/request/retrieve-notifications-request.dto';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';
import { GetCommonStudentsRequestDto } from '@/dtos/request/get-common-students-request.dto';

describe('TeacherService', () => {
  let teacherService: TeacherService;
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
            findOne: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            findOneBy: jest.fn(),
            findBy: jest.fn(),
            getCommonStudents: jest.fn(),
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

    teacherService = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    studentRepository = module.get<StudentRepository>(StudentRepository);
    teacherStudentRepository = module.get<TeacherStudentRepository>(
      TeacherStudentRepository,
    );
  });

  describe('registerStudent', () => {
    it('should throw an error if the teacher does not exist', async () => {
      teacherRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const mockDto: RegisterStudentsRequestDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudent(mockDto)).rejects.toThrow(
        new HttpException('Teacher is not existed.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if any student does not exist', async () => {
      teacherRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ id: 1 } as Teacher);
      studentRepository.findBy = jest.fn().mockResolvedValue([]);

      const mockDto: RegisterStudentsRequestDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudent(mockDto)).rejects.toThrow(
        new HttpException(
          'Have student is not existed!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should save teacher-student associations when data is valid', async () => {
      teacherRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ id: 1 } as Teacher);
      studentRepository.findBy = jest
        .fn()
        .mockResolvedValue([{ id: 2 }] as Student[]);
      teacherStudentRepository.save = jest.fn().mockResolvedValue(null);

      const mockDto: RegisterStudentsRequestDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await teacherService.registerStudent(mockDto);

      expect(teacherStudentRepository.save).toHaveBeenCalledWith([
        { teacher: { id: 1 }, student: { id: 2 } },
      ]);
    });
  });
  //
  describe('getCommonStudents', () => {
    it('should throw an error if any teacher does not exist', async () => {
      teacherRepository.findBy = jest.fn().mockResolvedValue([]);

      const getCommonStudentRequestDto = {
        teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
      };

      await expect(
        teacherService.getCommonStudents(getCommonStudentRequestDto),
      ).rejects.toThrow(
        new HttpException(
          'Have teacher is not existed!',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should return a list of common students', async () => {
      teacherRepository.findBy = jest
        .fn()
        .mockResolvedValue([{ id: 1 }, { id: 2 }] as Teacher[]);
      studentRepository.getCommonStudents = jest
        .fn()
        .mockResolvedValue([
          { email: 'studentjon@gmail.com' },
          { email: 'studentbob@gmail.com' },
        ] as Student[]);

      const getCommonStudentDto: GetCommonStudentsRequestDto = {
        teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
      };

      const result =
        await teacherService.getCommonStudents(getCommonStudentDto);

      expect(result).toEqual({
        student: ['studentjon@gmail.com', 'studentbob@gmail.com'],
      });
    });

    it('should return an empty list of common students', async () => {
      teacherRepository.findBy = jest
        .fn()
        .mockResolvedValue([{ id: 1 }, { id: 2 }] as Teacher[]);
      studentRepository.getCommonStudents = jest.fn().mockResolvedValue(null);

      const getCommonStudentDto: GetCommonStudentsRequestDto = {
        teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
      };

      const result =
        await teacherService.getCommonStudents(getCommonStudentDto);

      expect(result).toEqual({ student: [] });
    });
  });
  //
  describe('suspendStudent', () => {
    it('should throw an error if the student does not exist', async () => {
      studentRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const mockDto: SuspendStudentRequestDto = {
        student: 'studentmary@gmail.com',
      };

      await expect(teacherService.suspendStudent(mockDto)).rejects.toThrow(
        new HttpException('Student is not existed!', HttpStatus.BAD_REQUEST),
      );
    });

    it('should suspend the student if they exist', async () => {
      studentRepository.findOneBy = jest
        .fn()
        .mockResolvedValue({ id: 1 } as Student);
      studentRepository.save = jest
        .fn()
        .mockImplementation((student: Student) => student);

      const mockDto: SuspendStudentRequestDto = {
        student: 'studentmary@gmail.com',
      };

      await teacherService.suspendStudent(mockDto);

      expect(studentRepository.save).toHaveBeenCalled();
    });
  });

  describe('retrieveForNotifications', () => {
    it('should throw an error if the teacher does not exist', async () => {
      teacherRepository.findOne = jest.fn().mockResolvedValue(null);

      const mockDto: RetrieveNotificationsRequestDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello students!',
      };

      await expect(
        teacherService.retrieveForNotifications(mockDto),
      ).rejects.toThrow(
        new HttpException('Teacher is not existed.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should return recipients for notifications', async () => {
      teacherRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: 1 } as Teacher);
      studentRepository.retrieveForNotifications = jest
        .fn()
        .mockResolvedValue([
          { email: 'studentagnes@gmail.com' },
          { email: 'studentmiche@gmail.com' },
        ] as Student[]);

      const mockDto: RetrieveNotificationsRequestDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello @studentagnes@gmail.com @studentmiche@gmail.com',
      };

      const result = await teacherService.retrieveForNotifications(mockDto);

      expect(result).toEqual({
        recipients: ['studentagnes@gmail.com', 'studentmiche@gmail.com'],
      });
    });

    it('should return empty list of recipients for notifications', async () => {
      teacherRepository.findOne = jest
        .fn()
        .mockResolvedValue({ id: 1 } as Teacher);
      studentRepository.retrieveForNotifications = jest
        .fn()
        .mockResolvedValue(null);

      const mockDto: RetrieveNotificationsRequestDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello',
      };

      const result = await teacherService.retrieveForNotifications(mockDto);

      expect(result).toEqual({
        recipients: [],
      });
    });
  });
});
