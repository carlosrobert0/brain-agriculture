import {
  registerDecorator,
  type ValidationOptions,
  ValidatorConstraint,
  type ValidatorConstraintInterface,
  type ValidationArguments,
} from "class-validator"

@ValidatorConstraint({ async: false })
export class IsValidFarmAreasConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { totalArea, arableArea, vegetationArea } = args.object as any

    if (typeof totalArea !== "number" || typeof arableArea !== "number" || typeof vegetationArea !== "number") {
      return false
    }

    return arableArea + vegetationArea <= totalArea
  }

  defaultMessage(args: ValidationArguments) {
    return "A soma da área agricultável e vegetação não pode ultrapassar a área total"
  }
}

export function IsValidFarmAreas(validationOptions?: ValidationOptions) {
  return (object: Object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsValidFarmAreasConstraint,
    })
  }
}
