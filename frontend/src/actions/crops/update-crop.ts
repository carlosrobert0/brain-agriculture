import { api } from "@/lib/api";
import { cropSchema } from "./schema";
import { CreateCropDto } from "./dto/create-crop-dto";

export async function updateCrop(id: string, cropData: CreateCropDto) {
  try {
    const validatedData = cropSchema.parse(cropData);

    const response = await api(`crops/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });

    return response;
  } catch (error) {
    console.error('Error updating crop:', error);
    throw error;
  }
}