import { z } from 'zod';

export const harvestSchema = z.object({
  id: z.string().optional(),
  year: z.string().min(1, "Ano é obrigatório"),
  season: z.string().min(1, "Estação é obrigatória"),
  farmId: z.string().min(1, "ID da fazenda é obrigatório"),
});

export type HarvestData = z.infer<typeof harvestSchema>;