import { cn } from '@/lib/utils';
import { Label } from '../ui/label';
import { Checkbox } from '../ui/checkbox';

type ParamsType = {
  name: string;
  defaultChecked?: boolean;
  labelText: string;
  className?: string;
  disabled?: boolean;
};

function FormCheckbox({
  name,
  defaultChecked,
  labelText,
  className,
  disabled,
}: ParamsType) {
  return (
    <div className={cn('flex flex-row items-center gap-2', className)}>
      <Checkbox
        id={name}
        name={name}
        defaultChecked={defaultChecked}
        disabled={disabled}
      />
      <Label htmlFor={name} className='text-sm font-normal'>
        {labelText}
      </Label>
    </div>
  );
}
export default FormCheckbox;
