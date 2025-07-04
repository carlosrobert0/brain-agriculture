import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber, IsPositive, Min } from "class-validator"
import { Type } from "class-transformer"
import { IsValidFarmAreas } from "../../common/validators/farm-areas.validator"

export class CreateFarmDto {
  @ApiProperty({
    description: "Nome da propriedade rural",
    example: "Fazenda São João",
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: "Cidade onde está localizada a fazenda",
    example: "Ribeirão Preto",
  })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({
    description: "Estado onde está localizada a fazenda",
    example: "SP",
  })
  @IsString()
  @IsNotEmpty()
  state: string

  @ApiProperty({
    description: "Área total da fazenda em hectares",
    example: 100.5,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  @IsValidFarmAreas()
  totalArea: number

  @ApiProperty({
    description: "Área agricultável em hectares",
    example: 80.0,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  arableArea: number

  @ApiProperty({
    description: "Área de vegetação em hectares",
    example: 20.5,
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  vegetationArea: number

  @ApiProperty({
    description: "ID do produtor proprietário da fazenda",
    example: "clp123abc456def789",
  })
  @IsString()
  @IsNotEmpty()
  producerId: string
}
