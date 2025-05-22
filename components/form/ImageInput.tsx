import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ImageInputParams = {
  name: string;
  labelText?: string;
};

function ImageInput({ name, labelText }: ImageInputParams) {
  return (
    <div className='mb-4'>
      <Label htmlFor={name} className='capitalize tracking-tight text-base'>
        {labelText || name}
      </Label>
      <Input id={name} name={name} type='file' accept='image/*' required />
    </div>
  );
}
export default ImageInput;
