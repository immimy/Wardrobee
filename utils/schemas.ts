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

function validateImageFile({
  maxUploadSize = 1024 * 1024 * 0.5,
  maxUploadSizeText = '0.5MB',
  optional = false,
}: {
  maxUploadSize?: number;
  maxUploadSizeText?: string;
  optional?: boolean;
}) {
  const acceptedFileTypes = 'image/';
  return z
    .instanceof(File)
    .refine((file) => {
      if (optional) return true;
      return file && file.size <= maxUploadSize;
    }, `File size must be less than ${maxUploadSizeText}`)
    .refine((file) => {
      if (optional) return true;
      return file && file.type.startsWith(acceptedFileTypes);
    }, 'File must be an image');
}

function validateProductVariant({
  sizeRequired,
  colorRequired,
  requiredId,
}: {
  sizeRequired: boolean;
  colorRequired: boolean;
  requiredId: boolean;
}) {
  return (
    z
      .object({
        id: z.string().optional(),
        size: z.string().optional(),
        color: z.string().optional(),
        stock: z.coerce
          .number('Please provide product stock.')
          .int('Product stock must be an integer.')
          .nonnegative('Product stock must not less than 0'),
        isOnSale: z.coerce.boolean(),
        discount: z.coerce
          .number()
          .int('Discount must be an integer.')
          .nonnegative('Discount must not less than 0')
          .optional(),
      })
      .refine((input) => {
        return !(requiredId && !input.id);
      }, 'Product id is required.')
      .refine((input) => {
        return !(sizeRequired && !input.size);
      }, 'Product size is required.')
      .refine((input) => {
        return !(colorRequired && !input.color);
      }, 'Product color is required.')
      .transform((input) => {
        if (!input.isOnSale) {
          return { ...input, discount: 0 };
        }
        return input;
      })
      // NOTED:
      // "isOnSale" field must be removed before performing an operation to prisma.
      .transform((input) => {
        const { isOnSale, ...data } = input;

        // Field cleaning
        if (sizeRequired) {
          return { ...data, color: null };
        } else if (colorRequired) {
          return { ...data, size: null };
        } else {
          return { ...data, size: null, color: null };
        }
      })
  );
}

///////////////////// Schemas /////////////////////

export const imageSchema = validateImageFile({});
export const optionalImageSchema = validateImageFile({ optional: true });

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
    .nonnegative('Price must not less than 0.'),
  featured: z.coerce.boolean(),
});
export const productUpdateSchema = productSchema
  .extend({
    id: z.string().nonempty('Please provide product id.'),
    image: z.string(),
  })
  // Cleaning image input if user did not pass an image.
  .transform((input) => {
    const { image, ...data } = input;
    if (!image) return data;
    return input;
  });

const clothesVariantSchema = (requiredId: boolean) =>
  validateProductVariant({
    sizeRequired: true,
    colorRequired: false,
    requiredId,
  });
const bagVariantSchema = (requiredId: boolean) =>
  validateProductVariant({
    sizeRequired: false,
    colorRequired: true,
    requiredId,
  });
const accessoryVariantSchema = (requiredId: boolean) =>
  validateProductVariant({
    sizeRequired: false,
    colorRequired: false,
    requiredId,
  });
export const allProductVariantsSchema = ({
  category,
  requiredId,
}: {
  category: ProductCategory;
  requiredId?: boolean;
}) => {
  switch (category) {
    case 'clothes':
      return z.array(clothesVariantSchema(requiredId || false));
    case 'bag':
      return z.array(bagVariantSchema(requiredId || false));
    case 'accessory':
      return z.array(accessoryVariantSchema(requiredId || false));
  }
};

export const shippingAddressSchema = z.object({
  receiver: z.string(),
  address: z.string(),
  phoneNumber: z.string(),
  isDefault: z.coerce.boolean(),
});

export const cartItemSchema = z.object({
  productVariantId: z.string(),
  quantity: z.coerce
    .number()
    .default(1)
    .transform((input) => {
      // Quantity must not be negative or equal to zero
      if (input < 1) return 1;
      // Quantity must be an integer
      return Math.floor(input);
    }),
});
