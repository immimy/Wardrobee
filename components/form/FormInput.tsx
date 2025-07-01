import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ParamsType = {
  type: string;
  name: string;
  labelText?: string;
  defaultValue?: string;
  placeholder?: string;
};

function FormInput({
  type,
  name,
  labelText,
  defaultValue,
  placeholder,
}: ParamsType) {
  return (
    <div className='mb-4'>
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
        defaultValue={defaultValue}
        placeholder={placeholder}
        required
      />
    </div>
  );
}
export default FormInput;
