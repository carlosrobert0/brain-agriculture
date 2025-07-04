import { Controller, Get } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { DashboardService } from "./dashboard.service"

@ApiTags("dashboard")
@Controller("dashboard")
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get("stats")
  @ApiOperation({ summary: "Obter estatísticas gerais do dashboard" })
  @ApiResponse({ status: 200, description: "Estatísticas do dashboard" })
  getStats() {
    return this.dashboardService.getStats()
  }

  @Get("farms-by-state")
  @ApiOperation({ summary: "Obter distribuição de fazendas por estado" })
  @ApiResponse({ status: 200, description: "Fazendas agrupadas por estado" })
  getFarmsByState() {
    return this.dashboardService.getFarmsByState()
  }

  @Get("crops-by-type")
  @ApiOperation({ summary: "Obter distribuição de culturas por tipo" })
  @ApiResponse({ status: 200, description: "Culturas agrupadas por tipo" })
  getCropsByType() {
    return this.dashboardService.getCropsByType()
  }

  @Get("land-use")
  @ApiOperation({ summary: "Obter distribuição do uso do solo" })
  @ApiResponse({ status: 200, description: "Uso do solo (agricultável vs vegetação)" })
  getLandUse() {
    return this.dashboardService.getLandUse()
  }
}
