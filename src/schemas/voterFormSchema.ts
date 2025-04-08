import { z } from 'zod';
import { Mode } from '@/contexts/ModeContext';

// Form validation schema
export const VoterFormSchema = z.object({
  mode: z.custom<Mode>(),
  zipCode: z
    .string()
    .length(5, 'ZIP code must be exactly 5 digits')
    .regex(/^\d+$/, 'ZIP code must contain only numbers'),
  priorities: z
    .array(
      z
        .string()
        .max(250, 'Priority must be less than 250 characters')
    )
    .min(1, 'Must have at least 1 priority')
    .max(6, 'Must have no more than 6 priorities')
});

export type VoterFormValues = z.infer<typeof VoterFormSchema>;

// This schema is used to validate user input before sending to the API
// It ensures that:
// - The ZIP code is exactly 5 digits and contains only numbers
// - Between 1 and 6 priorities are provided, none of which are empty
