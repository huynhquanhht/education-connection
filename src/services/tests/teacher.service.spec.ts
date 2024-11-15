import { Test, TestingModule } from '@nestjs/testing';
import { TeacherService } from '@/services/teacher.service';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterStudentsRequestDto } from '@/dtos/request/register-students-request.dto';
import { GetCommonStudentsResponseDto } from '@/dtos/response/get-common-student-response.dto';
import { SuspendStudentRequestDto } from '@/dtos/request/suspend-student-request.dto';
import { RetrieveNotificationsRequestDto } from '@/dtos/request/retrieve-notifications-request.dto';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';

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
            getByEmail: jest.fn(),
            getByEmails: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            getByEmails: jest.fn(),
            getCommonStudents: jest.fn(),
            getByEmail: jest.fn(),
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

    teacherService = module.get<TeacherService>(TeacherService);
    teacherRepository = module.get<TeacherRepository>(TeacherRepository);
    studentRepository = module.get<StudentRepository>(StudentRepository);
    teacherStudentRepository = module.get<TeacherStudentRepository>(
      TeacherStudentRepository,
    );
  });

  it('should be defined', () => {
    expect(teacherService).toBeDefined();
  });
//
  describe('registerStudent', () => {
    it('should throw an error if the teacher does not exist', async () => {
      jest.spyOn(teacherRepository, 'getByEmail').mockResolvedValue(null);

      const mockDto: RegisterStudentsRequestDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudent(mockDto)).rejects.toThrow(
        new HttpException('Teacher is not existed.', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if any student does not exist', async () => {
      jest.spyOn(teacherRepository, 'getByEmail').mockResolvedValue({ id: 1 } as Teacher);
      jest.spyOn(studentRepository, 'getByEmails').mockResolvedValue([]);

      const mockDto: RegisterStudentsRequestDto = {
        teacher: 'teacherken@gmail.com',
        students: ['studentjon@gmail.com'],
      };

      await expect(teacherService.registerStudent(mockDto)).rejects.toThrow(
        new HttpException(
          'There is student data that has not been created previously.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should save teacher-student associations when data is valid', async () => {
      jest.spyOn(teacherRepository, 'getByEmail').mockResolvedValue({ id: 1 } as Teacher);
      jest.spyOn(studentRepository, 'getByEmails').mockResolvedValue([{ id: 2 }] as Student[]);
      jest.spyOn(teacherStudentRepository, 'save').mockResolvedValue(null);

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
      jest.spyOn(teacherRepository, 'getByEmails').mockResolvedValue([]);

      const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];

      await expect(
        teacherService.getCommonStudents(teacherEmails),
      ).rejects.toThrow(
        new HttpException(
          'There is teacher data that has not been created previously.',
          HttpStatus.BAD_REQUEST,
        ),
      );
    });

    it('should return a list of common students', async () => {
      jest.spyOn(teacherRepository, 'getByEmails').mockResolvedValue([
        { id: 1 } ,
        { id: 2 },
      ]as Teacher[]) ;
      jest.spyOn(studentRepository, 'getCommonStudents').mockResolvedValue([
        { email: 'studentjon@gmail.com' },
        { email: 'studentbob@gmail.com' },
      ] as Student[]) ;

      const teacherEmails = ['teacherken@gmail.com', 'teacherjoe@gmail.com'];

      const result = await teacherService.getCommonStudents(teacherEmails);

      expect(result).toEqual({
        student: ['studentjon@gmail.com', 'studentbob@gmail.com'],
      });
    });
  });
//
  describe('suspendStudent', () => {
    it('should throw an error if the student does not exist', async () => {
      jest.spyOn(studentRepository, 'getByEmail').mockResolvedValue(null);

      const mockDto: SuspendStudentRequestDto = {
        student: 'studentmary@gmail.com',
      };

      await expect(teacherService.suspendStudent(mockDto)).rejects.toThrow(
        new HttpException('No student found!', HttpStatus.NOT_FOUND),
      );
    });

    it('should suspend the student if they exist', async () => {
      jest.spyOn(studentRepository, 'getByEmail').mockResolvedValue({ id: 1 }  as Student);
      jest.spyOn(studentRepository, 'suspendStudent').mockResolvedValue(null as never);

      const mockDto: SuspendStudentRequestDto = {
        student: 'studentmary@gmail.com',
      };

      await teacherService.suspendStudent(mockDto);

      expect(studentRepository.suspendStudent).toHaveBeenCalledWith({ id: 1 });
    });
  });
//
  describe('retrieveForNotifications', () => {
    it('should throw an error if the teacher does not exist', async () => {
      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue(null);

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
      jest.spyOn(teacherRepository, 'findOne').mockResolvedValue({ id: 1 } as Teacher);
      jest.spyOn(studentRepository, 'retrieveForNotifications').mockResolvedValue(
        [
          { email: 'studentagnes@gmail.com' } ,
          { email: 'studentmiche@gmail.com' },
        ] as Student[]
      );

      const mockDto: RetrieveNotificationsRequestDto = {
        teacher: 'teacherken@gmail.com',
        notification: 'Hello @studentagnes@gmail.com @studentmiche@gmail.com',
      };

      const result = await teacherService.retrieveForNotifications(mockDto);

      expect(result).toEqual({
        recipients: ['studentagnes@gmail.com', 'studentmiche@gmail.com'],
      });
    });
  });

});

