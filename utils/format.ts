export const priceFormatter = (input: number): string => {
  const thaiBaht = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  });
  return thaiBaht.format(Number(input));
};

export const capitalizeFirstLetter = (input: string): string => {
  return input[0].toUpperCase() + input.slice(1);
};
