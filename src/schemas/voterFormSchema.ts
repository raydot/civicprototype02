import { z } from 'zod';
import { Mode } from '@/types/api';

// Form validation schema
export const VoterFormSchema = z.object({
  mode: z.enum(['current', 'demo'] as const).optional(),
  zipCode: z
    .string()
    .min(5, 'ZIP code must be at least 5 characters')
    .max(10, 'ZIP code must not exceed 10 characters')
    .optional(),
  priorities: z
    .array(
      z
        .string()
    )
    .min(1, 'At least one priority is required')
    .optional(),
});

export type VoterFormValues = z.infer<typeof VoterFormSchema>;
