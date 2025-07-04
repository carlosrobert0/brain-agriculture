import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsNumber, IsInt, Min, Max } from "class-validator"
import { Type } from "class-transformer"

export class CreateHarvestDto {
  @ApiProperty({
    description: "Ano da safra",
    example: 2024,
    minimum: 2000,
    maximum: 2050,
  })
  @Type(() => Number)
  @IsNumber()
  @IsInt()
  @Min(2000)
  @Max(2050)
  year: number

  @ApiProperty({
    description: "Temporada da safra",
    example: "Safra",
    enum: ["Verão", "Outono", "Inverno", "Primavera", "Safra", "Safrinha"],
  })
  @IsString()
  @IsNotEmpty()
  season: string

  @ApiProperty({
    description: "ID da fazenda onde ocorre a safra",
    example: "clp123abc456def789",
  })
  @IsString()
  @IsNotEmpty()
  farmId: string
}
