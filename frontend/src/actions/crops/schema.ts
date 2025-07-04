import { z } from 'zod';

export const cropSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Nome da cultura é obrigatório"),
  area: z.number().positive("Área deve ser um número positivo"),
  harvestId: z.string(),
});

export type CropData = z.infer<typeof cropSchema>;