import { ClassRepository } from '@/repositories/class.repository';
import { DataSource } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { Class } from '@/entities/class.entity';

describe('ClassRepository', () => {
  let classRepository: ClassRepository;
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
        ClassRepository,
        { provide: DataSource, useValue: mockDataSource },
      ],
    }).compile();

    classRepository = module.get<ClassRepository>(ClassRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getByName', () => {
    it('Should return correct data', async () => {
      const mockClass = new Class(1, '18T5');
      classRepository.findOne = jest.fn().mockResolvedValue(mockClass);
      const existClass: Class = await classRepository.getByName('18T5');

      expect(existClass.id).toEqual(mockClass.id);
    });
  });
});
