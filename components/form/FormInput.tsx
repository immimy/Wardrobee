import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

function FormInput({
  type,
  name,
  label,
  labelText,
  defaultValue,
}: {
  type: string;
  name: string;
  label?: boolean;
  labelText?: string;
  defaultValue: string;
}) {
  return (
    <div>
      {label && <Label htmlFor={name}>{labelText ?? name}</Label>}
      <Input type={type} id={name} name={name} defaultValue={defaultValue} />
    </div>
  );
}
export default FormInput;
