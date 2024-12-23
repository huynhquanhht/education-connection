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
import RequestUtils from '@/utils/regex.util';
import { RetrieveNotificationsResponseDto } from '@/dtos/response/retrieve-notifications-response.dto';
import { GetCommonStudentsRequestDto } from '@/dtos/request/get-common-students-request.dto';
import { In } from 'typeorm';
import { Messages } from '@/constants/message';

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
    const { teacher: teacherEmail, students: studentEmails } =
      registerStudentDto;
    let existTeacher: Teacher = await this.teacherRepository.findOneBy({
      email: teacherEmail,
    });
    if (!existTeacher) {
      throw new HttpException(
        Messages.TEACHER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }
    let existStudents: Student[] = await this.studentRepository.findBy({
      email: In(studentEmails),
    });
    if (existStudents.length != studentEmails.length) {
      throw new HttpException(
        Messages.HAVE_STUDENT_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }

    let newTeacherStudents: TeacherStudent[] = existStudents.map((student) => ({
      teacher: existTeacher,
      student: student,
    }));
    await this.teacherStudentRepository.save(newTeacherStudents);
  }

  async getCommonStudents(
    getCommonStudentRequestDto: GetCommonStudentsRequestDto,
  ): Promise<GetCommonStudentsResponseDto> {
    const { teacher: teacherEmails } = getCommonStudentRequestDto;
    let existTeachers: Teacher[] = await this.teacherRepository.findBy({
      email: In(teacherEmails),
    });
    if (existTeachers?.length != teacherEmails.length) {
      throw new HttpException(
        Messages.HAVE_TEACHER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }
    let commonStudents: Student[] =
      await this.studentRepository.getCommonStudents(existTeachers);

    return { student: commonStudents?.map((element) => element.email) || [] };
  }

  async suspendStudent(
    suspendStudentDto: SuspendStudentRequestDto,
  ): Promise<void> {
    let existStudent: Student = await this.studentRepository.findOneBy({
      email: suspendStudentDto.student,
    });
    if (!existStudent) {
      throw new HttpException(
        Messages.STUDENT_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }
    existStudent.isSuspended = true;
    await this.studentRepository.save(existStudent);
  }

  async retrieveForNotifications({
    teacher,
    notification,
  }: RetrieveNotificationsRequestDto): Promise<RetrieveNotificationsResponseDto> {
    const existTeacher = await this.teacherRepository.findOne({
      where: { email: teacher },
    });
    if (!existTeacher) {
      throw new HttpException(
        Messages.TEACHER_NOT_EXIST,
        HttpStatus.BAD_REQUEST,
      );
    }
    const mentionedStudents =
      RequestUtils.extractMentionedStudents(notification);
    const students = await this.studentRepository.retrieveForNotifications(
      existTeacher.id,
      mentionedStudents,
    );
    return { recipients: students?.map((student) => student.email) || [] };
  }
}
