import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsNotEmpty, IsEnum } from "class-validator"
import { IsValidDocument } from "../../common/validators/document.validator"
import { DocumentType } from "@prisma/client"

export class CreateProducerDto {
  @ApiProperty({
    description: "Nome do produtor rural",
    example: "João Silva",
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: "CPF ou CNPJ do produtor",
    example: "12345678901",
  })
  @IsString()
  @IsNotEmpty()
  @IsValidDocument()
  document: string

  @ApiProperty({
    description: "Tipo do documento",
    enum: DocumentType,
    example: DocumentType.CPF,
  })
  @IsEnum(DocumentType)
  documentType: DocumentType
}
