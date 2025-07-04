import { api } from "@/lib/api";
import { harvestSchema } from "./schema";
import { CreateHarvestDto } from "./dto/create-harvest-dto";

export async function createHarvest(cropData: CreateHarvestDto) {
  try {
    const validatedData = harvestSchema.parse(cropData);
    const response = await api('harvests', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    return response
  } catch (error) {
    console.error('Error creating harvest:', error);
    throw error;
  }
}