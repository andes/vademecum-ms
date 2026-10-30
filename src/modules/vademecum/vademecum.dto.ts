import { z } from 'zod';

export const searchMedicationsSchema = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export type SearchMedicationsDTO = z.infer<typeof searchMedicationsSchema>;
