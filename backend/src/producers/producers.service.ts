import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"
import { CreateProducerDto } from "./dto/create-producer.dto"
import { UpdateProducerDto } from "./dto/update-producer.dto"

@Injectable()
export class ProducersService {
  constructor(private prisma: PrismaService) { }

  async create(createProducerDto: CreateProducerDto) {
    const { document } = createProducerDto

    const cleanDocument = document.replace(/[^\d]/g, "")

    const existingProducer = await this.prisma.producer.findUnique({
      where: { document: cleanDocument },
    })

    if (existingProducer) {
      throw new ConflictException("CPF/CNPJ já cadastrado")
    }

    return this.prisma.producer.create({
      data: {
        ...createProducerDto,
        document: cleanDocument,
      },
      include: {
        farms: true,
      },
    })
  }

  async findAll() {
    return this.prisma.producer.findMany({
      include: {
        farms: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })
  }

  async findOne(id: string) {
    const producer = await this.prisma.producer.findUnique({
      where: { id },
      include: {
        farms: {
          include: {
            harvests: {
              include: {
                crops: true,
              },
            },
          },
        },
      },
    })

    if (!producer) {
      throw new NotFoundException("Produtor não encontrado")
    }

    return producer
  }

  async update(id: string, updateProducerDto: UpdateProducerDto) {
    await this.findOne(id)

    const updateData = { ...updateProducerDto }

    if (updateData.document) {
      updateData.document = updateData.document.replace(/[^\d]/g, "")

      const existingProducer = await this.prisma.producer.findFirst({
        where: {
          document: updateData.document,
          NOT: { id },
        },
      })

      if (existingProducer) {
        throw new ConflictException("CPF/CNPJ já cadastrado")
      }
    }

    return this.prisma.producer.update({
      where: { id },
      data: updateData,
      include: {
        farms: true,
      },
    })
  }

  async remove(id: string) {
    await this.findOne(id)

    await this.prisma.producer.delete({
      where: { id },
    })
  }
}
