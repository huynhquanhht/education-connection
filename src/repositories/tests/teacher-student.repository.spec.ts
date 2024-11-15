import { Test, TestingModule } from '@nestjs/testing';
import { TeacherStudentRepository } from '@/repositories/teacher-student.repository';
import { DataSource } from 'typeorm';

describe('TeacherStudentRepository', () => {
	let teacherStudentRepository: TeacherStudentRepository;

	const mockSave = jest.fn();
	const mockFind = jest.fn();
	const mockCreateEntityManager = jest.fn();

	const mockDataSource = {
		createEntityManager: mockCreateEntityManager,
	};

	beforeEach(async () => {
		// Mock the `createEntityManager` behavior to return repository functions
		mockCreateEntityManager.mockReturnValue({
			save: mockSave,
			find: mockFind,
			createQueryRunner: jest.fn().mockReturnValue({getMetadata: jest.fn()})
		});
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				TeacherStudentRepository,
				{ provide: DataSource, useValue: mockDataSource },
			],
		}).compile();

		teacherStudentRepository = module.get<TeacherStudentRepository>(TeacherStudentRepository);


	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('TeacherStudentRepository', () => {
		it('should be defined', () => {
			expect(teacherStudentRepository).toBeDefined();
		});
	});

});
