import { z } from 'zod/v4';

export function validateWithZodSchema<T extends z.ZodType>(
  schema: T,
  data: unknown
): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = z.flattenError(result.error);
    const errorMessages = Object.values(errors.fieldErrors).flat().join(', ');
    throw new Error(errorMessages);
  }
  return result.data;
}

///////////////////// Schemas /////////////////////

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be less than 30 characters.'),
});
