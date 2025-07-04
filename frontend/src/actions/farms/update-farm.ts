import { api } from "@/lib/api";
import { farmSchema } from "./schema";
import { CreateFarmDto } from "./dto/create-farm-dto";

export async function updateFarm(id: string, farmData: CreateFarmDto) {
  try {
    const validatedData = farmSchema.parse(farmData);

    const response = await api(`farms/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });

    return response;
  } catch (error) {
    console.error('Error updating farm:', error);
    throw error;
  }
}