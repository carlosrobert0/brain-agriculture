import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { PrismaService } from '../prisma/prisma.service';

describe('DashboardService', () => {
  let service: DashboardService;
  let prisma: PrismaService;

  const prismaMock = {
    farm: {
      count: jest.fn(),
      aggregate: jest.fn(),
      groupBy: jest.fn(),
    },
    producer: {
      count: jest.fn(),
    },
    crop: {
      count: jest.fn(),
      groupBy: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('getStats', () => {
    it('should return aggregated stats', async () => {
      prismaMock.farm.count.mockResolvedValue(10);
      prismaMock.farm.aggregate.mockResolvedValue({ _sum: { totalArea: 500 } });
      prismaMock.producer.count.mockResolvedValue(5);
      prismaMock.crop.count.mockResolvedValue(20);

      const result = await service.getStats();

      expect(prismaMock.farm.count).toHaveBeenCalled();
      expect(prismaMock.farm.aggregate).toHaveBeenCalled();
      expect(prismaMock.producer.count).toHaveBeenCalled();
      expect(prismaMock.crop.count).toHaveBeenCalled();

      expect(result).toEqual({
        totalFarms: 10,
        totalHectares: 500,
        totalProducers: 5,
        totalCrops: 20,
      });
    });

    it('should return zero for totalHectares if _sum.totalArea is null', async () => {
      prismaMock.farm.count.mockResolvedValue(0);
      prismaMock.farm.aggregate.mockResolvedValue({ _sum: { totalArea: null } });
      prismaMock.producer.count.mockResolvedValue(0);
      prismaMock.crop.count.mockResolvedValue(0);

      const result = await service.getStats();

      expect(result.totalHectares).toBe(0);
    });
  });

  describe('getFarmsByState', () => {
    it('should return array of farms grouped by state', async () => {
      const grouped = [
        { state: 'SP', _count: { id: 7 } },
        { state: 'MG', _count: { id: 3 } },
      ];
      prismaMock.farm.groupBy.mockResolvedValue(grouped);

      const result = await service.getFarmsByState();

      expect(prismaMock.farm.groupBy).toHaveBeenCalledWith({
        by: ['state'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
      });

      expect(result).toEqual([
        { state: 'SP', count: 7 },
        { state: 'MG', count: 3 },
      ]);
    });
  });

  describe('getCropsByType', () => {
    it('should return crops area grouped by crop name', async () => {
      const grouped = [
        { name: 'Soja', _sum: { area: 100 } },
        { name: 'Milho', _sum: { area: 50 } },
      ];
      prismaMock.crop.groupBy.mockResolvedValue(grouped);

      const result = await service.getCropsByType();

      expect(prismaMock.crop.groupBy).toHaveBeenCalledWith({
        by: ['name'],
        _sum: { area: true },
        orderBy: { _sum: { area: 'desc' } },
      });

      expect(result).toEqual([
        { crop: 'Soja', area: 100 },
        { crop: 'Milho', area: 50 },
      ]);
    });

    it('should return zero area if _sum.area is null', async () => {
      const grouped = [{ name: 'Arroz', _sum: { area: null } }];
      prismaMock.crop.groupBy.mockResolvedValue(grouped);

      const result = await service.getCropsByType();

      expect(result[0].area).toBe(0);
    });
  });

  describe('getLandUse', () => {
    it('should return array with arable and vegetation areas', async () => {
      prismaMock.farm.aggregate.mockResolvedValue({
        _sum: { arableArea: 120, vegetationArea: 80 },
      });

      const result = await service.getLandUse();

      expect(prismaMock.farm.aggregate).toHaveBeenCalledWith({
        _sum: { arableArea: true, vegetationArea: true },
      });

      expect(result).toEqual([
        { type: 'Área Agricultável', area: 120 },
        { type: 'Vegetação', area: 80 },
      ]);
    });

    it('should return zero if aggregated values are null', async () => {
      prismaMock.farm.aggregate.mockResolvedValue({
        _sum: { arableArea: null, vegetationArea: null },
      });

      const result = await service.getLandUse();

      expect(result[0].area).toBe(0);
      expect(result[1].area).toBe(0);
    });
  });
});
