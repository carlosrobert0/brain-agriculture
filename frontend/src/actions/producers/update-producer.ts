import { api } from "@/lib/api";
import { producerSchema } from "./schema";
import { CreateProducerDto } from "./dto/create-producer-dto";

export async function updateProducer(id: string, producerData: CreateProducerDto) {
  try {
    const validatedData = producerSchema.parse(producerData);

    const response = await api(`producers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(validatedData),
    });

    return response;
  } catch (error) {
    console.error('Error updating producer:', error);
    throw error;
  }
}