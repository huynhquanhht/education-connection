import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterStudentsRequestDto } from '@/dtos/request/register-students-request.dto';
import { GetCommonStudentsResponseDto } from '@/dtos/response/get-common-student-response.dto';
import { RetrieveNotificationsRequestDto } from '@/dtos/request/retrieve-notifications-request.dto';
import { SuspendStudentRequestDto } from '@/dtos/request/suspend-student-request.dto';
import { TeacherRepository } from '@/repositories/teacher.repository';
import { StudentRepository } from '@/repositories/student.repository';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { Teacher } from '@/entities/teacher.entity';
import { Student } from '@/entities/student.entity';
import { TeacherStudent } from '@/entities/teacher-student.entity';
import RequestUtils from '@/utils/request';
import { RetrieveNotificationsResponseDto } from '@/dtos/response/retrieve-notifications-response.dto';
import { GetCommonStudentsRequestDto } from '@/dtos/request/get-common-students-request.dto';

@Injectable()
export class TeacherService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherStudentRepository: TeacherStudentRepository,
  ) {}

  async registerStudent(
    registerStudentDto: RegisterStudentsRequestDto,
  ): Promise<void> {
    try {
      // Check teacher exists
      let existTeacher: Teacher = await this.teacherRepository.getByEmail(
        registerStudentDto.teacher,
      );
      if (!existTeacher) {
        throw new HttpException(
          'Teacher is not existed.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Check students exist
      let existStudents: Student[] = await this.studentRepository.getByEmails(
        registerStudentDto.students,
      );
      if (existStudents.length != registerStudentDto.students.length) {
        throw new HttpException(
          'There is student data that has not been created previously.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Register student teacher
      let newTeacherStudents: TeacherStudent[] = existStudents.map(
        (student) => {
          return {
            teacher: existTeacher,
            student: student,
          };
        },
      );
      await this.teacherStudentRepository.save(newTeacherStudents);
    } catch (error) {
      throw error;
    }
  }

  async getCommonStudents(
    getCommonStudentRequestDto: GetCommonStudentsRequestDto,
  ): Promise<GetCommonStudentsResponseDto> {
    try {
      const { teacher: teacherEmails } = getCommonStudentRequestDto;
      // Check teacher exists
      let teachers: Teacher[] =
        await this.teacherRepository.getByEmails(teacherEmails);
      if (
        !teachers ||
        teachers.length == 0 ||
        teachers.length != teacherEmails.length
      ) {
        throw new HttpException(
          'There is teacher data that has not been created previously.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Get common students
      let commonStudents: Student[] =
        await this.studentRepository.getCommonStudents(teachers);
      let result = commonStudents?.map((element) => element.email) || [];
      return { student: result };
    } catch (error) {
      throw error;
    }
  }

  async suspendStudent(
    suspendStudentDto: SuspendStudentRequestDto,
  ): Promise<void> {
    try {
      // Check student exists
      let existStudent: Student = await this.studentRepository.getByEmail(
        suspendStudentDto.student,
      );
      if (!existStudent) {
        throw new HttpException('No student found!', HttpStatus.NOT_FOUND);
      }
      // Suspend Student
      await this.studentRepository.suspendStudent(existStudent);
    } catch (error) {
      throw error;
    }
  }

  async retrieveForNotifications({
    teacher,
    notification,
  }: RetrieveNotificationsRequestDto): Promise<RetrieveNotificationsResponseDto> {
    try {
      // Check student exists
      const existTeacher = await this.teacherRepository.findOne({
        where: { email: teacher },
      });
      if (!existTeacher) {
        throw new HttpException(
          'Teacher is not existed.',
          HttpStatus.BAD_REQUEST,
        );
      }
      // Extract mentioned students
      const mentionedStudents =
        RequestUtils.extractMentionedStudents(notification);
      // Retrieve for notifications
      const students = await this.studentRepository.retrieveForNotifications(
        existTeacher.id,
        mentionedStudents,
      );
      return { recipients: students?.map((student) => student.email) || [] };
    } catch (error) {
      throw error;
    }
  }
}
