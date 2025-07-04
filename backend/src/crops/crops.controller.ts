import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { CropsService } from "./crops.service"
import { CreateCropDto } from "./dto/create-crop.dto"
import { UpdateCropDto } from "./dto/update-crop.dto"

@ApiTags("crops")
@Controller("crops")
export class CropsController {
  constructor(private readonly cropsService: CropsService) { }

  @Post()
  @ApiOperation({ summary: 'Criar uma nova cultura' })
  @ApiResponse({ status: 201, description: 'Cultura criada com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  create(@Body() createCropDto: CreateCropDto) {
    return this.cropsService.create(createCropDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as culturas" })
  @ApiResponse({ status: 200, description: "Lista de culturas" })
  findAll() {
    return this.cropsService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar cultura por ID' })
  @ApiResponse({ status: 200, description: 'Cultura encontrada' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  findOne(@Param('id') id: string) {
    return this.cropsService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar cultura" })
  @ApiResponse({ status: 200, description: "Cultura atualizada com sucesso" })
  @ApiResponse({ status: 404, description: "Cultura não encontrada" })
  update(@Param('id') id: string, @Body() updateCropDto: UpdateCropDto) {
    return this.cropsService.update(id, updateCropDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir cultura' })
  @ApiResponse({ status: 204, description: 'Cultura excluída com sucesso' })
  @ApiResponse({ status: 404, description: 'Cultura não encontrada' })
  remove(@Param('id') id: string) {
    return this.cropsService.remove(id);
  }
}
