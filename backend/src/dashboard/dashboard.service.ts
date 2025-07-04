import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) { }

  async getStats() {
    const [totalFarms, totalHectares, totalProducers, totalCrops] = await Promise.all([
      this.prisma.farm.count(),
      this.prisma.farm.aggregate({
        _sum: {
          totalArea: true,
        },
      }),
      this.prisma.producer.count(),
      this.prisma.crop.count(),
    ])

    return {
      totalFarms,
      totalHectares: totalHectares._sum.totalArea || 0,
      totalProducers,
      totalCrops,
    }
  }

  async getFarmsByState() {
    const farmsByState = await this.prisma.farm.groupBy({
      by: ["state"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    })

    return farmsByState.map((item) => ({
      state: item.state,
      count: item._count.id,
    }))
  }

  async getCropsByType() {
    const cropsByType = await this.prisma.crop.groupBy({
      by: ["name"],
      _sum: {
        area: true,
      },
      orderBy: {
        _sum: {
          area: "desc",
        },
      },
    })

    return cropsByType.map((item) => ({
      crop: item.name,
      area: item._sum.area || 0,
    }))
  }

  async getLandUse() {
    const landUse = await this.prisma.farm.aggregate({
      _sum: {
        arableArea: true,
        vegetationArea: true,
      },
    })

    return [
      {
        type: "Área Agricultável",
        area: landUse._sum.arableArea || 0,
      },
      {
        type: "Vegetação",
        area: landUse._sum.vegetationArea || 0,
      },
    ]
  }
}
