import { Controller, Get, Post, Patch, Param, Delete, HttpCode, HttpStatus, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { HarvestsService } from "./harvests.service"
import { CreateHarvestDto } from "./dto/create-harvest.dto"
import { UpdateHarvestDto } from "./dto/update-harvest.dto"

@ApiTags("harvests")
@Controller("harvests")
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) { }

  @Post()
  @ApiOperation({ summary: "Criar uma nova safra" })
  @ApiResponse({ status: 201, description: "Safra criada com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 404, description: "Fazenda não encontrada" })
  create(@Body() createHarvestDto: CreateHarvestDto) {
    return this.harvestsService.create(createHarvestDto)
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as safras" })
  @ApiResponse({ status: 200, description: "Lista de safras" })
  findAll() {
    return this.harvestsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar safra por ID' })
  @ApiResponse({ status: 200, description: 'Safra encontrada' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  findOne(@Param('id') id: string) {
    return this.harvestsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar safra" })
  @ApiResponse({ status: 200, description: "Safra atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Safra não encontrada" })
  update(@Param('id') id: string, @Body() updateHarvestDto: UpdateHarvestDto) {
    return this.harvestsService.update(id, updateHarvestDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir safra' })
  @ApiResponse({ status: 204, description: 'Safra excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Safra não encontrada' })
  remove(@Param('id') id: string) {
    return this.harvestsService.remove(id);
  }
}
