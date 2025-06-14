export type FormState = {
  message: string;
  type: 'default' | 'success' | 'error';
};

export type ActionFunction = (
  prevState: any,
  formData: FormData
) => Promise<FormState>;

export type ProductCategory = 'clothes' | 'bag' | 'accessory';
