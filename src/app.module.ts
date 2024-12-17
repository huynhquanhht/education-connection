import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfigAsync } from '@/config/database.config';
import { TeacherModule } from './modules/teacher.module';
import { ClassService } from './services/class.service';
import { ClassModule } from './modules/class.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync(typeOrmConfigAsync),
    TeacherModule,
    ClassModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
