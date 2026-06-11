import { z } from 'zod';

export const searchMedicationsSchema = z.object({
    q: z.string().optional(),
    drug: z.coerce.number().optional(),
    action: z.coerce.number().optional(),
    status: z.enum(['A', 'I']).optional(),
    snomed: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export const searchDrugsSchema = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export const searchActionsSchema = z.object({
    q: z.string().optional(),
    limit: z.coerce.number().min(1).max(100).default(20),
});

export const medicationParamsSchema = z.object({
    id: z.coerce.number(),
});

export type SearchMedicationsDTO = z.infer<typeof searchMedicationsSchema>;
export type SearchDrugsDTO = z.infer<typeof searchDrugsSchema>;
export type SearchActionsDTO = z.infer<typeof searchActionsSchema>;
