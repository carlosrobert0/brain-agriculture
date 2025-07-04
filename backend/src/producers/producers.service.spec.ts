import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { ProducersService } from './producers.service';
import { PrismaService } from '../prisma/prisma.service';
import { DocumentType } from '@prisma/client';

describe('ProducersService', () => {
  let service: ProducersService;
  let prisma: PrismaService;

  const prismaMock = {
    producer: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProducersService,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    service = module.get<ProducersService>(ProducersService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should clean document and create producer if CPF/CNPJ not exists', async () => {
      const dto = {
        name: 'João Silva',
        document: '123.456.789-01',
        documentType: 'CPF' as DocumentType,
      };

      prismaMock.producer.findUnique.mockResolvedValue(null);
      prismaMock.producer.create.mockResolvedValue({ id: '1', ...dto, document: '12345678901', farms: [] });

      const result = await service.create(dto);

      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith({
        where: { document: '12345678901' },
      });
      expect(prismaMock.producer.create).toHaveBeenCalledWith({
        data: { ...dto, document: '12345678901' },
        include: { farms: true },
      });
      expect(result).toMatchObject({
        id: '1',
        name: 'João Silva',
        document: '12345678901',
        farms: [],
      });
    });

    it('should throw ConflictException if CPF/CNPJ already exists', async () => {
      prismaMock.producer.findUnique.mockResolvedValue({ id: '1' });

      await expect(
        service.create({ name: 'João', document: '12345678901', documentType: 'CPF' }),
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.producer.create).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return producer if found', async () => {
      const producer = { id: '1', name: 'João', farms: [] };
      prismaMock.producer.findUnique.mockResolvedValue(producer);

      const result = await service.findOne('1');
      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { farms: { include: { harvests: { include: { crops: true } } } } },
      });
      expect(result).toBe(producer);
    });

    it('should throw NotFoundException if not found', async () => {
      prismaMock.producer.findUnique.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update producer and clean document if present', async () => {
      const id = '1';
      const updateDto = { name: 'João Atualizado', document: '123.456.789-01' };

      prismaMock.producer.findUnique.mockResolvedValue({
        id,
        document: '12345678901',
        farms: [],
      });
      prismaMock.producer.findFirst.mockResolvedValue(null);
      prismaMock.producer.update.mockResolvedValue({
        id,
        name: updateDto.name,
        document: '12345678901',
        farms: [],
      });

      const result = await service.update(id, updateDto);

      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id },
      }));
      expect(prismaMock.producer.findFirst).toHaveBeenCalledWith({
        where: { document: '12345678901', NOT: { id } },
      });
      expect(prismaMock.producer.update).toHaveBeenCalledWith({
        where: { id },
        data: { name: updateDto.name, document: '12345678901' },
        include: { farms: true },
      });

      expect(result.name).toBe(updateDto.name);
      expect(result.document).toBe('12345678901');
    });

    it('should throw ConflictException if document conflicts', async () => {
      prismaMock.producer.findUnique.mockResolvedValue({ id: '1', document: '12345678901' });
      prismaMock.producer.findFirst.mockResolvedValue({ id: '2' });

      await expect(
        service.update('1', { document: '123.456.789-01' }),
      ).rejects.toThrow(ConflictException);

      expect(prismaMock.producer.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      prismaMock.producer.findUnique.mockResolvedValue(null);

      await expect(service.update('1', { name: 'Novo Nome' })).rejects.toThrow(NotFoundException);

      expect(prismaMock.producer.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete producer if exists', async () => {
      prismaMock.producer.findUnique.mockResolvedValue({
        id: '1',
        farms: [],
      });
      prismaMock.producer.delete.mockResolvedValue({});

      await service.remove('1');

      expect(prismaMock.producer.findUnique).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: '1' },
      }));
      expect(prismaMock.producer.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if producer does not exist', async () => {
      prismaMock.producer.findUnique.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);

      expect(prismaMock.producer.delete).not.toHaveBeenCalled();
    });
  });
});
