import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateHarvestDto } from "./dto/create-harvest.dto"
import { UpdateHarvestDto } from "./dto/update-harvest.dto"

@Injectable()
export class HarvestsService {
  constructor(private prisma: PrismaService) { }

  async create(createHarvestDto: CreateHarvestDto) {
    // Verifica se a fazenda existe
    const farm = await this.prisma.farm.findUnique({
      where: { id: createHarvestDto.farmId },
    })

    if (!farm) {
      throw new NotFoundException("Fazenda não encontrada")
    }

    return this.prisma.harvest.create({
      data: createHarvestDto,
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crops: true,
      },
    })
  }

  async findAll() {
    return this.prisma.harvest.findMany({
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crops: true,
      },
      orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    })
  }

  async findOne(id: string) {
    const harvest = await this.prisma.harvest.findUnique({
      where: { id },
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crops: true,
      },
    })

    if (!harvest) {
      throw new NotFoundException("Safra não encontrada")
    }

    return harvest
  }

  async update(id: string, updateHarvestDto: UpdateHarvestDto) {
    await this.findOne(id) // Verifica se existe

    // Se está atualizando a fazenda, verifica se existe
    if (updateHarvestDto.farmId) {
      const farm = await this.prisma.farm.findUnique({
        where: { id: updateHarvestDto.farmId },
      })

      if (!farm) {
        throw new NotFoundException("Fazenda não encontrada")
      }
    }

    return this.prisma.harvest.update({
      where: { id },
      data: updateHarvestDto,
      include: {
        farm: {
          include: {
            producer: true,
          },
        },
        crops: true,
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id) // Verifica se existe

    await this.prisma.harvest.delete({
      where: { id },
    })
  }
}
