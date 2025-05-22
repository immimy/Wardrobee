import { Input } from '../ui/input';
import { Label } from '../ui/label';

function FormInput({
  type,
  name,
  labelText,
  defaultValue,
  placeholder,
}: {
  type: string;
  name: string;
  isLabel?: boolean;
  labelText?: string;
  defaultValue?: string;
  placeholder?: string;
}) {
  return (
    <div className='mb-4'>
      <Label htmlFor={name} className='capitalize tracking-tight text-base'>
        {labelText ?? name}
      </Label>
      <Input
        type={type}
        id={name}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
export default FormInput;
