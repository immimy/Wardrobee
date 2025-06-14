import { z, ZodType } from 'zod/v4';
import { ProductCategory } from './types';

export function validateWithZodSchema<T>(schema: ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = z.flattenError(result.error);
    const fieldErrors = Object.values(errors.fieldErrors).flat();
    const formErrors = errors.formErrors;
    const errorMessages = [...fieldErrors, ...formErrors].join(', ');
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

export function validateProductVariant(
  variant: unknown,
  category: ProductCategory
) {
  switch (category) {
    case 'clothes':
      return validateWithZodSchema(clothesVariantsSchema, variant);
    case 'bag':
      return validateWithZodSchema(bagVariantsSchema, variant);
    case 'accessory':
      return validateWithZodSchema(accessoryVariantsSchema, variant);
    default:
      const error: never = category;
      throw new Error('Product category is not supported.');
  }
}

///////////////////// Schemas /////////////////////

export const userSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters.')
    .max(30, 'Username must be less than 30 characters.'),
});

export const productSchema = z.object({
  name: z.string().nonempty('Please provide product name.'),
  category: z.enum(['clothes', 'bag', 'accessory'], {
    error: (iss) => {
      return `This "${iss.input}" category is not supported.`;
    },
  }),
  brand: z.enum(
    [
      'aero style',
      'free spirit',
      'legacy trek',
      'prestige',
      'calista',
      'wander lux',
    ],
    {
      error: (iss) => {
        return `This "${iss.input}" brand is not supported.`;
      },
    }
  ),
  image: z.string().nonempty('Please provide product image.'),
  description: z.string().optional(),
  price: z.coerce
    .number()
    .int('Price must be an integer.')
    .positive('Price must be positive.'),
  featured: z.coerce.boolean().optional(),
});

export const clothesVariantsSchema = z.array(
  createProductVariantSchema({
    sizeRequired: true,
    colorRequired: false,
  })
);
export const bagVariantsSchema = z.array(
  createProductVariantSchema({
    sizeRequired: false,
    colorRequired: true,
  })
);
export const accessoryVariantsSchema = z.array(
  createProductVariantSchema({
    sizeRequired: false,
    colorRequired: false,
  })
);

export function createProductVariantSchema({
  sizeRequired,
  colorRequired,
}: {
  sizeRequired: boolean;
  colorRequired: boolean;
}) {
  return z
    .object({
      size: z.string().optional(),
      color: z.string().optional(),
      stock: z.coerce
        .number('Please provide product stock.')
        .int('Product stock must be an integer.')
        .positive('Product stock must be positive.'),
      sales: z.coerce
        .number()
        .int('Sales quantity must be an integer.')
        .positive('Sales quantity must be positive.')
        .optional(),
      isOnSale: z.coerce.boolean().optional(),
      discount: z.coerce
        .number()
        .int('Discount must be an integer.')
        .positive('Discount must be positive.')
        .optional(),
    })
    .refine((input) => {
      return !(sizeRequired && !input.size);
    }, 'Product size is required.')
    .refine((input) => {
      return !(colorRequired && !input.color);
    }, 'Product color is required.');
}
