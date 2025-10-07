import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { ChangeEventHandler } from 'react';

type ParamsType = {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string | number;
  value?: string | number;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
  className?: string;
  readOnly?: boolean;
};

function FormInput({
  type,
  name,
  labelText,
  defaultValue,
  value,
  onChange,
  placeholder,
  className,
  readOnly,
}: ParamsType) {
  return (
    <div className={cn('mb-4', className)}>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue && String(defaultValue)}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        readOnly={readOnly}
      />
    </div>
  );
}
export default FormInput;
