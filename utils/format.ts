export const priceFormatter = (input: number): string => {
  const thaiBaht = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  });
  return thaiBaht.format(Number(input));
};

export const capitalizeFirstLetter = (input: any): string | any => {
  if (typeof input !== 'string') return input;
  if (input.length <= 1) return input.toUpperCase();
  return input[0].toUpperCase() + input.slice(1);
};

export const lowerCaseString = (input: string | number): string => {
  if (typeof input !== 'string') return String(input);
  return input.toLowerCase();
};
