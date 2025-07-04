import { api } from "@/lib/api";
import { harvestSchema } from "./schema";
import { CreateHarvestDto } from "./dto/create-harvest-dto";

export async function updateHarvest(id: string, harvestData: CreateHarvestDto) {
  try {
    const validatedData = harvestSchema.parse(harvestData);

    const response = await api(`harvests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });

    return response;
  } catch (error) {
    console.error('Error updating harvest:', error);
    throw error;
  }
}