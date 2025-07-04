import { api } from "@/lib/api";
import { cropSchema } from "./schema";
import { CreateCropDto } from "./dto/create-crop-dto";

export async function createCrop(cropData: CreateCropDto) {
  try {
    const validatedData = cropSchema.parse(cropData);
    const response = await api('crops', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    return response
  } catch (error) {
    console.error('Error creating crop:', error);
    throw error;
  }
}