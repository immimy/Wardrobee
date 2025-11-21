export const collectProductCreate = (formData: FormData) => {
  // input's name — fieldset[prop]
  // e.g. product[category], variant1[stock]
  let fieldsetList: string[] = [];
  let result: any = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$')) continue;

    const regex = /[^[\]]+/g;
    const indexes = key.match(regex); // ['product','category']
    if (!indexes) throw new Error('Regex matching fail...');
    const fieldset = indexes[0];
    const prop = indexes[1];

    if (!fieldsetList.includes(fieldset)) {
      fieldsetList.push(fieldset);
      result[fieldset] = { [prop]: value };
      continue;
    }

    result[fieldset][prop] = value;
  }

  return result;
};

export const collectProductUpdate = (
  formData: FormData
): {
  product: { [field: string]: any };
  deletedVariants: string[];
  createdVariants: { [field: string]: any }[];
  updatedVariants: { [field: string]: any }[];
} => {
  // input's name
  // — fieldset[prop] -> product[id]
  // — fieldset[id][prop] -> variant[`variantId`][stock]
  let fieldsetList: string[] = [];

  let product: { [field: string]: any } = {};
  let deletedVariants: string[] = [];
  let variants: { [field: string]: any } = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$')) continue;

    const regex = /[^[\]]+/g;
    const indexes = key.match(regex); // ['product','id'] | ['variant',`variantId`,'stock']
    if (!indexes) throw new Error('Regex matching fail...');

    let fieldset = '';
    let prop = '';
    let isDeleted = false;
    switch (indexes[0]) {
      case 'deletedVariant': {
        isDeleted = true;
        break;
      }
      case 'product': {
        fieldset = indexes[0];
        prop = indexes[1];
        break;
      }
      case 'variant': {
        fieldset = `${indexes[0]}[${indexes[1]}]`;
        prop = indexes[2];
        break;
      }
      default: {
        throw new Error(`This '${indexes[0]} field is not supported.'`);
      }
    }

    // Delete variant
    if (isDeleted) {
      deletedVariants.push(value as string);
      continue;
    }
    // Create/Update variant
    if (fieldset.startsWith('variant')) {
      if (!fieldsetList.includes(fieldset)) {
        fieldsetList.push(fieldset);
        variants[fieldset] = { [prop]: value };
      } else {
        variants[fieldset][prop] = value;
      }
      continue;
    }
    // Product
    product[prop] = value;
  }

  const { createdVariants, updatedVariants } = Object.values(variants).reduce(
    (acc, variant) => {
      if (variant['id']) {
        // Update variant
        const updatedVariants = acc.updatedVariants;
        updatedVariants.push(variant);
        return { ...acc, updatedVariants };
      } else {
        // Create variant
        const createdVariants = acc.createdVariants;
        createdVariants.push(variant);
        return { ...acc, createdVariants };
      }
    },
    {
      createdVariants: [],
      updatedVariants: [],
    }
  );

  return {
    product,
    deletedVariants,
    createdVariants,
    updatedVariants,
  };
};
