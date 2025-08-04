import { ChangeEvent } from 'react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ImageInputParams = {
  name: string;
  labelText?: string;
  onChange?: (e:ChangeEvent<HTMLInputElement>) => void;
};

function ImageInput({ name, labelText ,onChange}: ImageInputParams) {
  return (
    <div className='mb-4'>
      <Label
        htmlFor={name}
        className='mb-1 capitalize tracking-tight text-base'
      >
        {labelText || name}
      </Label>
      <Input id={name} name={name} type='file' accept='image/*' required onChange={onChange} />
    </div>
  );
}
export default ImageInput;
