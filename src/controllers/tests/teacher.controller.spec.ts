import { Test, TestingModule } from '@nestjs/testing';
import { TeacherController } from '@/controllers/teacher.controller';
import { TeacherService } from '@/services/teacher.service';
import { GetCommonStudentsResponseDto } from '@/dtos/response/get-common-student-response.dto';
import { SuspendStudentRequestDto } from '@/dtos/request/suspend-student-request.dto';
import { GetCommonStudentsRequestDto } from '@/dtos/request/get-common-students-request.dto';

describe('TeacherController', () => {
  let teacherController: TeacherController;
  let teacherService: TeacherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeacherController],
      providers: [
        {
          provide: TeacherService,
          useValue: {
            registerStudent: jest.fn(),
            getCommonStudents: jest.fn(),
            suspendStudent: jest.fn(),
            retrieveForNotifications: jest.fn(),
          },
        },
      ],
    }).compile();

    teacherController = module.get<TeacherController>(TeacherController);
    teacherService = module.get<TeacherService>(TeacherService);
  });

  it('should be defined', () => {
    expect(teacherController).toBeDefined();
  });

  it('should call registerStudent in TeacherService with the correct data', async () => {
    const mockDto = {
      teacher: 'teacherken@gmail.com',
      students: ['studentjon@gmail.com'],
    };
    jest.spyOn(teacherService, 'registerStudent').mockResolvedValue();

    await teacherController.registerStudents(mockDto);

    expect(teacherService.registerStudent).toHaveBeenCalledWith(mockDto);
  });

  it('should call getCommonStudents in TeacherService with the correct data', async () => {
    const mockDto: GetCommonStudentsRequestDto = {
      teacher: ['teacherken@gmail.com', 'teacherjoe@gmail.com'],
    };
    const mockResponse = {
      students: ['studentjon@gmail.com', 'studentbob@gmail.com'],
    };
    jest
      .spyOn(teacherService, 'getCommonStudents')
      .mockResolvedValue(
        mockResponse as unknown as GetCommonStudentsResponseDto,
      );

    const result = await teacherController.getCommonStudents(mockDto);

    expect(teacherService.getCommonStudents).toHaveBeenCalledWith(mockDto);
    expect(result).toEqual(mockResponse);
  });
  //
  it('should call suspendStudent in TeacherService with the correct data', async () => {
    const mockDto = { student: 'studentmary@gmail.com' };
    jest.spyOn(teacherService, 'suspendStudent').mockResolvedValue();

    await teacherController.suspendStudent(
      mockDto as unknown as SuspendStudentRequestDto,
    );

    expect(teacherService.suspendStudent).toHaveBeenCalledWith(mockDto);
  });
  //
  it('should call retrieveForNotifications in TeacherService with the correct data', async () => {
    const mockDto = {
      teacher: 'teacherken@gmail.com',
      notification:
        'Hello students! @studentagnes@gmail.com @studentmiche@gmail.com',
    };
    const mockResponse = {
      recipients: ['studentbob@gmail.com', 'studentagnes@gmail.com'],
    };
    jest
      .spyOn(teacherService, 'retrieveForNotifications')
      .mockResolvedValue(mockResponse);

    const result = await teacherController.retrieveForNotifications(mockDto);

    expect(teacherService.retrieveForNotifications).toHaveBeenCalledWith(
      mockDto,
    );
    expect(result).toEqual(mockResponse);
  });
});
