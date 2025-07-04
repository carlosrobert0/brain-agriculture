import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateFarmDto } from "./dto/create-farm.dto"
import { UpdateFarmDto } from "./dto/update-farm.dto"

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) { }

  async create(createFarmDto: CreateFarmDto) {
    // Verifica se o produtor existe
    const producer = await this.prisma.producer.findUnique({
      where: { id: createFarmDto.producerId },
    })

    if (!producer) {
      throw new NotFoundException("Produtor não encontrado")
    }

    return this.prisma.farm.create({
      data: createFarmDto,
      include: {
        producer: true,
        harvests: true,
      },
    })
  }

  async findAll() {
    return this.prisma.farm.findMany({
      include: {
        producer: true,
        harvests: {
          include: {
            crops: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const farm = await this.prisma.farm.findUnique({
      where: { id },
      include: {
        producer: true,
        harvests: {
          include: {
            crops: true,
          },
        },
      },
    })

    if (!farm) {
      throw new NotFoundException("Fazenda não encontrada")
    }

    return farm
  }

  async update(id: string, updateFarmDto: UpdateFarmDto) {
    await this.findOne(id) // Verifica se existe

    // Se está atualizando o produtor, verifica se existe
    if (updateFarmDto.producerId) {
      const producer = await this.prisma.producer.findUnique({
        where: { id: updateFarmDto.producerId },
      })

      if (!producer) {
        throw new NotFoundException("Produtor não encontrado")
      }
    }

    return this.prisma.farm.update({
      where: { id },
      data: updateFarmDto,
      include: {
        producer: true,
        harvests: true,
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id) // Verifica se existe

    await this.prisma.farm.delete({
      where: { id },
    })
  }
}
