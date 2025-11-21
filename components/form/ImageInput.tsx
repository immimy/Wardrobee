import { ChangeEvent } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ImageInputParams = {
  name: string;
  labelText?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  required?: boolean;
};

function ImageInput({
  name,
  labelText,
  onChange,
  id,
  required = true,
}: ImageInputParams) {
  return (
    <div className='mb-4'>
      <Label
        htmlFor={id || name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText || name}
      </Label>
      <Input
        id={id || name}
        name={name}
        type='file'
        accept='image/*'
        required={required}
        onChange={onChange}
      />
    </div>
  );
}
export default ImageInput;
