import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { ProducersService } from "./producers.service"
import { CreateProducerDto } from "./dto/create-producer.dto"
import { UpdateProducerDto } from "./dto/update-producer.dto"

@ApiTags("producers")
@Controller("producers")
export class ProducersController {
  constructor(private readonly producersService: ProducersService) { }

  @Post()
  @ApiOperation({ summary: 'Criar um novo produtor rural' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso' })
  @ApiResponse({ status: 400, description: 'Dados inválidos' })
  @ApiResponse({ status: 409, description: 'CPF/CNPJ já cadastrado' })
  create(@Body() createProducerDto: CreateProducerDto) {
    return this.producersService.create(createProducerDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os produtores rurais" })
  @ApiResponse({ status: 200, description: "Lista de produtores" })
  findAll() {
    return this.producersService.findAll()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  findOne(@Param('id') id: string) {
    return this.producersService.findOne(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar produtor" })
  @ApiResponse({ status: 200, description: "Produtor atualizado com sucesso" })
  @ApiResponse({ status: 404, description: "Produtor não encontrado" })
  update(@Param('id') id: string, @Body() updateProducerDto: UpdateProducerDto) {
    return this.producersService.update(id, updateProducerDto)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Excluir produtor' })
  @ApiResponse({ status: 204, description: 'Produtor excluído com sucesso' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  remove(@Param('id') id: string) {
    return this.producersService.remove(id);
  }
}
