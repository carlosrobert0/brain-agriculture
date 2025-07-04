import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  type ValidationArguments,
} from "class-validator"

@ValidatorConstraint({ async: false })
export class IsValidDocumentConstraint implements ValidatorConstraintInterface {
  validate(document: string, args: ValidationArguments) {
    const documentType = (args.object as any).documentType

    if (!document || !documentType) {
      return false
    }

    const cleanDocument = document.replace(/[^\d]/g, "")

    if (documentType === "CPF") {
      return this.validateCPF(cleanDocument)
    } else if (documentType === "CNPJ") {
      return this.validateCNPJ(cleanDocument)
    }

    return false
  }

  defaultMessage(args: ValidationArguments) {
    const documentType = (args.object as any).documentType
    return `${documentType} inválido`
  }

  private validateCPF(cpf: string): boolean {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
      return false
    }

    let sum = 0
    for (let i = 0; i < 9; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (10 - i)
    }
    let remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(9))) return false

    sum = 0
    for (let i = 0; i < 10; i++) {
      sum += Number.parseInt(cpf.charAt(i)) * (11 - i)
    }
    remainder = (sum * 10) % 11
    if (remainder === 10 || remainder === 11) remainder = 0
    if (remainder !== Number.parseInt(cpf.charAt(10))) return false

    return true
  }

  private validateCNPJ(cnpj: string): boolean {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
      return false
    }

    const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

    let sum = 0
    for (let i = 0; i < 12; i++) {
      sum += Number.parseInt(cnpj.charAt(i)) * weights1[i]
    }
    let remainder = sum % 11
    const digit1 = remainder < 2 ? 0 : 11 - remainder

    if (digit1 !== Number.parseInt(cnpj.charAt(12))) return false

    sum = 0
    for (let i = 0; i < 13; i++) {
      sum += Number.parseInt(cnpj.charAt(i)) * weights2[i]
    }
    remainder = sum % 11
    const digit2 = remainder < 2 ? 0 : 11 - remainder

    return digit2 === Number.parseInt(cnpj.charAt(13))
  }
}

export function IsValidDocument(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidDocumentConstraint,
    })
  }
}
