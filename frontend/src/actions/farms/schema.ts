import { z } from 'zod';

export const farmSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(1, "O nome da fazenda é obrigatório"),
  city: z.string().min(1, "A cidade é obrigatória"),
  state: z.string().min(2, "O estado deve ter pelo menos 2 caracteres"),
  totalArea: z.number().positive("A área total deve ser um número positivo"),
  arableArea: z.number().positive("A área cultivável deve ser um número positivo"),
  vegetationArea: z.number().positive("A área de vegetação deve ser um número positivo"),
  producerId: z.string(),
});

export type FarmData = z.infer<typeof farmSchema>;