import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  ParseArrayPipe,
  Post,
  Query,
} from '@nestjs/common';
import { TeacherService } from '@/services/teacher.service';
import { RegisterStudentsRequestDto } from '@/dtos/request/register-students-request.dto';
import { RetrieveNotificationsRequestDto } from '@/dtos/request/retrieve-notifications-request.dto';
import { SuspendStudentRequestDto } from '@/dtos/request/suspend-student-request.dto';
import { GetCommonStudentsResponseDto } from '@/dtos/response/get-common-student-response.dto';
import { RetrieveNotificationsResponseDto } from '@/dtos/response/retrieve-notifications-response.dto';

@Controller('/api')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post('/register')
  @HttpCode(HttpStatus.NO_CONTENT)
  async registerStudents(
    @Body() registerStudentDto: RegisterStudentsRequestDto,
  ): Promise<void> {
    await this.teacherService.registerStudent(registerStudentDto);
  }

  @Get('/commonstudents')
  @HttpCode(HttpStatus.OK)
  getCommonStudents(
    @Query('teacher', new ParseArrayPipe({ items: String }))
    teacherEmails: string[],
  ): Promise<GetCommonStudentsResponseDto> {
    return this.teacherService.getCommonStudents([...teacherEmails]);
  }

  @Post('/suspend')
  @HttpCode(HttpStatus.NO_CONTENT)
  suspendStudent(
    @Body() suspendStudentDto: SuspendStudentRequestDto,
  ): Promise<void> {
    return this.teacherService.suspendStudent(suspendStudentDto);
  }

  @Post('/retrievefornotifications')
  @HttpCode(HttpStatus.OK)
  retrieveForNotifications(
    @Body() retrieveNotificationsDto: RetrieveNotificationsRequestDto,
  ): Promise<RetrieveNotificationsResponseDto> {
    return this.teacherService.retrieveForNotifications(
      retrieveNotificationsDto,
    );
  }
}
