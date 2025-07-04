import { api } from "@/lib/api";
import { producerSchema } from "./schema";
import { CreateProducerDto } from "./dto/create-producer-dto";

export async function createProducer(cropData: CreateProducerDto) {
  try {
    const validatedData = producerSchema.parse(cropData);
    const response = await api('producers', {
      method: 'POST',
      body: JSON.stringify(validatedData),
    });

    return response
  } catch (error) {
    console.error('Error creating producer:', error);
    throw error;
  }
}