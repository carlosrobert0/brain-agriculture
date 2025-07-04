import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator"
import { Type } from "class-transformer"

export class CreateCropDto {
  @ApiProperty({
    description: "Nome da cultura plantada",
    example: "Soja",
    enum: ["Soja", "Milho", "Algodão", "Café", "Cana-de-açúcar", "Arroz", "Feijão", "Trigo", "Mandioca", "Cacau"],
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: "Área plantada em hectares",
    example: 25.5,
  })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  area: number

  @ApiProperty({
    description: "ID da safra onde a cultura foi plantada",
    example: "clp123abc456def789",
  })
  @IsString()
  @IsNotEmpty()
  harvestId: string
}
