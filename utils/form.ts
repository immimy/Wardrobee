export const convertFormDataByFieldset = (formData: FormData) => {
  // input's name — fieldset[prop]
  // e.g. product[category], variant1[stock]
  let fieldsetList: string[] = [];
  let nestedFormData: any = {};

  for (const [key, value] of formData.entries()) {
    if (key.startsWith('$')) continue;

    const regex = /\[|\]/g;
    const indexes = key.split(regex, 2);
    const fieldset = indexes[0];
    const prop = indexes[1];

    if (!fieldsetList.includes(fieldset)) {
      fieldsetList.push(fieldset);
      nestedFormData[fieldset] = { [prop]: value };
      continue;
    }

    nestedFormData[fieldset][prop] = value;
  }

  return { fieldsetList, nestedFormData };
};
