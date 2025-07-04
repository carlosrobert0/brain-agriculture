import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { PrismaService } from '../prisma/prisma.service';

describe('FarmsService', () => {
  let service: FarmsService;
  let prisma: PrismaService;

  const prismaMock = {
    producer: {
      findUnique: jest.fn(),
    },
    farm: {
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
        FarmsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<FarmsService>(FarmsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a farm if producer exists', async () => {
      const dto = {
        name: 'Fazenda São João',
        city: 'Ribeirão Preto',
        state: 'SP',
        totalArea: 100.5,
        arableArea: 80,
        vegetationArea: 20.5,
        producerId: 'producer123',
      };

      prismaMock.producer.findUnique.mockResolvedValue({ id: 'producer123' });
      prismaMock.farm.create.mockResolvedValue({ id: 'farm123', ...dto, producer: { id: 'producer123' }, harvests: [] });

      const result = await service.create(dto);

      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith({ where: { id: dto.producerId } });
      expect(prismaMock.farm.create).toHaveBeenCalledWith({
        data: dto,
        include: { producer: true, harvests: true },
      });
      expect(result).toMatchObject({ id: 'farm123', name: dto.name });
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      prismaMock.producer.findUnique.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Fazenda X',
          city: 'Cidade X',
          state: 'XX',
          totalArea: 50,
          arableArea: 30,
          vegetationArea: 20,
          producerId: 'unknown',
        }),
      ).rejects.toThrow(NotFoundException);

      expect(prismaMock.farm.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return farm if found', async () => {
      const farm = {
        id: 'farm123',
        name: 'Fazenda São João',
        producer: { id: 'producer123' },
        harvests: [],
      };
      prismaMock.farm.findUnique.mockResolvedValue(farm);

      const result = await service.findOne('farm123');
      expect(result).toBe(farm);
    });

    it('should throw NotFoundException if farm not found', async () => {
      prismaMock.farm.findUnique.mockResolvedValue(null);

      await expect(service.findOne('farm123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update farm if exists and producerId exists (if provided)', async () => {
      const id = 'farm123';
      const updateDto = {
        name: 'Fazenda Atualizada',
        producerId: 'producer456',
      };

      prismaMock.farm.findUnique.mockResolvedValue({ id, producerId: 'producer123' });
      prismaMock.producer.findUnique.mockResolvedValue({ id: 'producer456' });
      prismaMock.farm.update.mockResolvedValue({ id, ...updateDto, producer: { id: 'producer456' }, harvests: [] });

      const result = await service.update(id, updateDto);

      expect(prismaMock.farm.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id } }),
      );
      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith({ where: { id: updateDto.producerId } });
      expect(prismaMock.farm.update).toHaveBeenCalledWith({
        where: { id },
        data: updateDto,
        include: { producer: true, harvests: true },
      });
      expect(result.name).toBe('Fazenda Atualizada');
    });

    it('should throw NotFoundException if farm does not exist', async () => {
      prismaMock.farm.findUnique.mockResolvedValue(null);

      await expect(service.update('farm123', { name: 'Nova' })).rejects.toThrow(NotFoundException);

      expect(prismaMock.farm.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if new producerId does not exist', async () => {
      prismaMock.farm.findUnique.mockResolvedValue({ id: 'farm123', producerId: 'oldProducer' });
      prismaMock.producer.findUnique.mockResolvedValue(null);

      await expect(service.update('farm123', { producerId: 'invalidProducer' })).rejects.toThrow(NotFoundException);

      expect(prismaMock.farm.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete farm if exists', async () => {
      prismaMock.farm.findUnique.mockResolvedValue({ id: 'farm123' });
      prismaMock.farm.delete.mockResolvedValue({});

      await service.remove('farm123');

      expect(prismaMock.farm.delete).toHaveBeenCalledWith({ where: { id: 'farm123' } });
    });

    it('should throw NotFoundException if farm does not exist', async () => {
      prismaMock.farm.findUnique.mockResolvedValue(null);

      await expect(service.remove('farm123')).rejects.toThrow(NotFoundException);

      expect(prismaMock.farm.delete).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return farms array', async () => {
      const farms = [
        { id: 'farm1', name: 'Fazenda 1', producer: { id: 'prod1' }, harvests: [] },
        { id: 'farm2', name: 'Fazenda 2', producer: { id: 'prod2' }, harvests: [] },
      ];
      prismaMock.farm.findMany.mockResolvedValue(farms);

      const result = await service.findAll();

      expect(result).toBe(farms);
      expect(prismaMock.farm.findMany).toHaveBeenCalledWith({
        include: {
          producer: true,
          harvests: {
            include: {
              crops: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    });
  });
});
