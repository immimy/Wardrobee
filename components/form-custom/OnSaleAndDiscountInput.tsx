'use client';

import { useState } from 'react';
import OnSaleCheckbox from '@/components/form-custom/OnSaleCheckbox';
import FormInput from '@/components/form-control/FormInput';

type ParamsType = {
  index?: number;
  discount?: number;
};

function OnSaleAndDiscountInput({ index, discount }: ParamsType) {
  const [isChecked, setIsChecked] = useState(Boolean(discount));

  return (
    <div className='md:flex gap-x-6'>
      <OnSaleCheckbox
        name={index ? `variant${index}[isOnSale]` : 'isOnSale'}
        isChecked={isChecked}
        setIsChecked={setIsChecked}
      />
      {isChecked && (
        <FormInput
          type='text'
          name={index ? `variant${index}[discount]` : 'discount'}
          labelText='discount (%)'
          defaultValue={discount || 0}
          className='max-w-[200px]'
        />
      )}
    </div>
  );
}
export default OnSaleAndDiscountInput;
