import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CropsService } from './crops.service';
import { PrismaService } from '../prisma/prisma.service';

describe('CropsService', () => {
  let service: CropsService;
  let prisma: typeof prismaMock;

  const prismaMock = {
    crop: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    harvest: {
      findUnique: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CropsService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<CropsService>(CropsService);
    prisma = prismaMock;

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create crop if harvest exists', async () => {
      const dto = { name: 'Corn', area: 10, harvestId: 'harvest123' };

      prisma.harvest.findUnique.mockResolvedValue({ id: 'harvest123' });
      prisma.crop.create.mockResolvedValue({ id: 'crop123', ...dto });

      const result = await service.create(dto);

      expect(prisma.harvest.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: dto.harvestId } }));
      expect(prisma.crop.create).toHaveBeenCalledWith(expect.objectContaining({ data: dto }));
      expect(result).toHaveProperty('id', 'crop123');
    });

    it('should throw NotFoundException if harvest does not exist', async () => {
      prisma.harvest.findUnique.mockResolvedValue(null);

      await expect(service.create({ name: '', area: 0, harvestId: 'invalid' }))
        .rejects.toThrow(NotFoundException);

      expect(prisma.crop.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return a list of crops', async () => {
      const crops = [{ id: '1' }, { id: '2' }];
      prisma.crop.findMany.mockResolvedValue(crops);

      const result = await service.findAll();

      expect(result).toEqual(crops);
      expect(prisma.crop.findMany).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return crop if it exists', async () => {
      const crop = { id: 'crop123' };
      prisma.crop.findUnique.mockResolvedValue(crop);

      const result = await service.findOne('crop123');

      expect(prisma.crop.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'crop123' } }));
      expect(result).toBe(crop);
    });

    it('should throw NotFoundException if crop does not exist', async () => {
      prisma.crop.findUnique.mockResolvedValue(null);

      await expect(service.findOne('invalid'))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update crop and verify new harvest', async () => {
      const id = 'crop123';
      const updateDto = { name: 'Soybean', harvestId: 'harvest456' };

      prisma.crop.findUnique.mockResolvedValue({ id });
      prisma.harvest.findUnique.mockResolvedValue({ id: 'harvest456' });
      prisma.crop.update.mockResolvedValue({ id, ...updateDto });

      const result = await service.update(id, updateDto);

      expect(prisma.crop.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id } }));
      expect(prisma.harvest.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'harvest456' } }));
      expect(prisma.crop.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id },
        data: updateDto,
      }));
      expect(result.name).toBe('Soybean');
    });

    it('should throw NotFoundException if crop does not exist', async () => {
      prisma.crop.findUnique.mockResolvedValue(null);

      await expect(service.update('invalid', { name: 'X' }))
        .rejects.toThrow(NotFoundException);

      expect(prisma.crop.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if new harvest does not exist', async () => {
      prisma.crop.findUnique.mockResolvedValue({ id: 'crop123' });
      prisma.harvest.findUnique.mockResolvedValue(null);

      await expect(service.update('crop123', { harvestId: 'invalid' }))
        .rejects.toThrow(NotFoundException);

      expect(prisma.crop.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete crop if it exists', async () => {
      prisma.crop.findUnique.mockResolvedValue({ id: 'crop123' });
      prisma.crop.delete.mockResolvedValue({});

      await service.remove('crop123');

      expect(prisma.crop.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 'crop123' } }));
      expect(prisma.crop.delete).toHaveBeenCalledWith({ where: { id: 'crop123' } });
    });

    it('should throw NotFoundException if crop does not exist', async () => {
      prisma.crop.findUnique.mockResolvedValue(null);

      await expect(service.remove('invalid'))
        .rejects.toThrow(NotFoundException);

      expect(prisma.crop.delete).not.toHaveBeenCalled();
    });
  });
});
