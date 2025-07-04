import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { HarvestsService } from './harvests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('HarvestsService', () => {
  let service: HarvestsService;
  let prisma: PrismaService;

  const prismaMock = {
    farm: {
      findUnique: jest.fn(),
    },
    harvest: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HarvestsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<HarvestsService>(HarvestsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create harvest if farm exists', async () => {
      const dto = {
        year: 2024,
        season: 'Safra',
        farmId: 'farm123',
      };

      prismaMock.farm.findUnique.mockResolvedValue({ id: 'farm123' });
      prismaMock.harvest.create.mockResolvedValue({ id: 'harvest123', ...dto, farm: { id: 'farm123', producer: {} }, crops: [] });

      const result = await service.create(dto);

      expect(prismaMock.farm.findUnique).toHaveBeenCalledWith({ where: { id: dto.farmId } });
      expect(prismaMock.harvest.create).toHaveBeenCalledWith({
        data: dto,
        include: {
          farm: { include: { producer: true } },
          crops: true,
        },
      });
      expect(result).toMatchObject({ id: 'harvest123', year: 2024, season: 'Safra' });
    });

    it('should throw NotFoundException if farm does not exist', async () => {
      prismaMock.farm.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ year: 2024, season: 'Safra', farmId: 'invalidFarm' }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.harvest.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of harvests', async () => {
      const harvests = [
        { id: 'h1', year: 2023, season: 'Safra', farm: { producer: {} }, crops: [] },
        { id: 'h2', year: 2024, season: 'Safrinha', farm: { producer: {} }, crops: [] },
      ];

      prismaMock.harvest.findMany.mockResolvedValue(harvests);

      const result = await service.findAll();

      expect(prismaMock.harvest.findMany).toHaveBeenCalledWith({
        include: {
          farm: { include: { producer: true } },
          crops: true,
        },
        orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
      });
      expect(result).toBe(harvests);
    });
  });

  describe('findOne', () => {
    it('should return harvest if found', async () => {
      const harvest = { id: 'h1', year: 2023, season: 'Safra', farm: { producer: {} }, crops: [] };
      prismaMock.harvest.findUnique.mockResolvedValue(harvest);

      const result = await service.findOne('h1');

      expect(prismaMock.harvest.findUnique).toHaveBeenCalledWith({
        where: { id: 'h1' },
        include: {
          farm: { include: { producer: true } },
          crops: true,
        },
      });
      expect(result).toBe(harvest);
    });

    it('should throw NotFoundException if harvest not found', async () => {
      prismaMock.harvest.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update harvest if exists and farmId exists (if provided)', async () => {
      const id = 'h1';
      const updateDto = { season: 'Safrinha', farmId: 'farm456' };

      prismaMock.harvest.findUnique.mockResolvedValue({ id, farmId: 'farm123' });
      prismaMock.farm.findUnique.mockResolvedValue({ id: 'farm456' });
      prismaMock.harvest.update.mockResolvedValue({ id, ...updateDto, farm: { id: 'farm456', producer: {} }, crops: [] });

      const result = await service.update(id, updateDto);

      expect(prismaMock.harvest.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id } }),
      );
      expect(prismaMock.farm.findUnique).toHaveBeenCalledWith({ where: { id: updateDto.farmId } });
      expect(prismaMock.harvest.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
        include: {
          farm: { include: { producer: true } },
          crops: true,
        },
      });
      expect(result.season).toBe('Safrinha');
    });

    it('should throw NotFoundException if harvest does not exist', async () => {
      prismaMock.harvest.findUnique.mockResolvedValue(null);

      await expect(service.update('h1', { season: 'Outono' })).rejects.toThrow(NotFoundException);

      expect(prismaMock.harvest.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if new farmId does not exist', async () => {
      prismaMock.harvest.findUnique.mockResolvedValue({ id: 'h1', farmId: 'farm123' });
      prismaMock.farm.findUnique.mockResolvedValue(null);

      await expect(service.update('h1', { farmId: 'invalidFarm' })).rejects.toThrow(NotFoundException);

      expect(prismaMock.harvest.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete harvest if exists', async () => {
      prismaMock.harvest.findUnique.mockResolvedValue({ id: 'h1' });
      prismaMock.harvest.delete.mockResolvedValue({});

      await service.remove('h1');

      expect(prismaMock.harvest.delete).toHaveBeenCalledWith({ where: { id: 'h1' } });
    });

    it('should throw NotFoundException if harvest does not exist', async () => {
      prismaMock.harvest.findUnique.mockResolvedValue(null);

      await expect(service.remove('h1')).rejects.toThrow(NotFoundException);

      expect(prismaMock.harvest.delete).not.toHaveBeenCalled();
    });
  });
});
