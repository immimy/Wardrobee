'use client';

import { CiCirclePlus } from 'react-icons/ci';

type ParamsType = {
  onClick: () => void;
};

function AddOptionButton({ onClick }: ParamsType) {
  return (
    <button
      type='button'
      onClick={onClick}
      className='my-6 flex justify-center items-center gap-x-3 w-full border-2 border-dashed border-border rounded-lg py-1.5 text-foreground hover:cursor-pointer'
    >
      <CiCirclePlus className='text-xl' />
      <p className='uppercase text-sm tracking-wider font-medium'>add option</p>
    </button>
  );
}
export default AddOptionButton;
