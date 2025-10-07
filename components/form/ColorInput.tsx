import { ChangeEventHandler } from 'react';
import { Label } from '../ui/label';

type ParamsType = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
};

function ColorInput({
  name,
  labelText,
  defaultValue,
  value,
  onChange,
  placeholder,
  disabled,
}: ParamsType) {
  return (
    <div className='mb-4'>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <input
        type='color'
        id={name}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        disabled={disabled}
        className='h-10 w-12 rounded-xl shadow-2xs'
      />
    </div>
  );
}
export default ColorInput;
