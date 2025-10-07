import { ChangeEventHandler } from 'react';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

type ParamsType = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
};

function FormTextarea({
  name,
  labelText,
  defaultValue,
  value,
  onChange,
}: ParamsType) {
  return (
    <div className='mb-4'>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText ?? name}
      </Label>
      <Textarea
        id={name}
        name={name}
        defaultValue={defaultValue}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
export default FormTextarea;
