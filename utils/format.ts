export const priceFormatter = (input: number): string => {
  const thaiBaht = new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
  });
  return thaiBaht.format(Number(input));
};
