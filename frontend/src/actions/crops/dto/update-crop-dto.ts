'use server'
import { CreateCropDto } from "./create-crop-dto";

export interface UpdateCropDto extends Partial<CreateCropDto> { }