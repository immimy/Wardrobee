import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

type ParamsType = { description: string | null };
function DescriptionContent({ description }: ParamsType) {
  if (!description) return null;

  return (
    <div className='group'>
      <p className='line-clamp-3 group-has-checked:line-clamp-none'>
        {description}
      </p>
      <label
        htmlFor='cutoff-btn'
        className='mt-2 flex gap-x-2 items-center hover:cursor-pointer'
      >
        <span className='text-xs rounded-full bg-primary size-6 grid place-items-center'>
          <FaChevronDown className='group-has-checked:hidden' />
          <FaChevronUp className='hidden group-has-checked:block' />
        </span>
        <input
          type='checkbox'
          id='cutoff-btn'
          className='appearance-none text-sm tracking-widest font-medium text-destructive hover:cursor-pointer before:content-["READ_MORE"] checked:before:content-["COLLAPSE"]'
        />
      </label>
    </div>
  );
}
export default DescriptionContent;
