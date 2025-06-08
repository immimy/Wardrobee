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

export function validateAvatar(file: unknown) {
  const maxUploadSize = 1024 * 1024 * 0.5; //0.5MB
  const maxUploadSizeText = '0.5MB';
  const acceptedFileTypes = 'image/';

  if (!file || !(file instanceof File)) {
    throw new Error('Please provide the file.');
  }
  if (!file.type.startsWith(acceptedFileTypes)) {
    throw new Error('File must be an image.');
  }
  if (file.size > maxUploadSize) {
    throw new Error(`File size must be less than ${maxUploadSizeText}.`);
  }

  return file as File;
}

///////////////////// Schemas /////////////////////

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be less than 30 characters.'),
});
