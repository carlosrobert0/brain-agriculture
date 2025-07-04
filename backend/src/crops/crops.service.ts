import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateCropDto } from "./dto/create-crop.dto"
import { UpdateCropDto } from "./dto/update-crop.dto"

@Injectable()
export class CropsService {
  constructor(private prisma: PrismaService) { }

  async create(createCropDto: CreateCropDto) {
    // Verifica se a safra existe
    const harvest = await this.prisma.harvest.findUnique({
      where: { id: createCropDto.harvestId },
    })

    if (!harvest) {
      throw new NotFoundException("Safra não encontrada")
    }

    return this.prisma.crop.create({
      data: createCropDto,
      include: {
        harvest: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    })
  }

  async findAll() {
    return this.prisma.crop.findMany({
      include: {
        harvest: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const crop = await this.prisma.crop.findUnique({
      where: { id },
      include: {
        harvest: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    })

    if (!crop) {
      throw new NotFoundException("Cultura não encontrada")
    }

    return crop
  }

  async update(id: string, updateCropDto: UpdateCropDto) {
    await this.findOne(id) // Verifica se existe

    // Se está atualizando a safra, verifica se existe
    if (updateCropDto.harvestId) {
      const harvest = await this.prisma.harvest.findUnique({
        where: { id: updateCropDto.harvestId },
      })

      if (!harvest) {
        throw new NotFoundException("Safra não encontrada")
      }
    }

    return this.prisma.crop.update({
      where: { id },
      data: updateCropDto,
      include: {
        harvest: {
          include: {
            farm: {
              include: {
                producer: true,
              },
            },
          },
        },
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id) // Verifica se existe

    await this.prisma.crop.delete({
      where: { id },
    })
  }
}
