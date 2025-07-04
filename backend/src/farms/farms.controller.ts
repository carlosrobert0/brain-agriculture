import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { FarmsService } from "./farms.service"
import { CreateFarmDto } from "./dto/create-farm.dto"
import { UpdateFarmDto } from "./dto/update-farm.dto"

@ApiTags("farms")
@Controller("farms")
export class FarmsController {
  constructor(private readonly farmsService: FarmsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova propriedade rural' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  create(@Body() createFarmDto: CreateFarmDto) {
    return this.farmsService.create(createFarmDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as propriedades rurais" })
  @ApiResponse({ status: 200, description: "Lista de fazendas" })
  findAll() {
    return this.farmsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  findOne(@Param('id') id: string) {
    return this.farmsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar fazenda" })
  @ApiResponse({ status: 200, description: "Fazenda atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Fazenda não encontrada" })
  update(@Param('id') id: string, @Body() updateFarmDto: UpdateFarmDto) {
    return this.farmsService.update(id, updateFarmDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  remove(@Param('id') id: string) {
    return this.farmsService.remove(id);
  }
}
