import { api } from "@/lib/api";
import { farmSchema } from "./schema";
import { CreateFarmDto } from "./dto/create-farm-dto";

export async function createFarm(farmData: CreateFarmDto) {
  try {
    const validatedData = farmSchema.parse(farmData);
    const response = await api('farms', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    return response
  } catch (error) {
    console.error('Error creating farm:', error);
    throw error;
  }
}