import { capitalizeFirstLetter } from '@/utils/format';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type ParamsType = {
  name: string;
  labelText: string;
  placeholder: string;
  itemList: Array<string | number>;
  defaultValue?: string;
  isLabel?: boolean;
  disabled?: boolean;
};

function FormSelect({
  name,
  labelText,
  placeholder,
  itemList,
  defaultValue,
  isLabel,
  disabled,
}: ParamsType) {
  return (
    <div className='mb-4'>
      {isLabel && (
        <Label
          htmlFor={name}
          className='mb-1 capitalize tracking-tight text-base'
        >
          {labelText}
        </Label>
      )}
      <Select name={name} defaultValue={defaultValue} disabled={disabled}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>{labelText}</SelectLabel>
            {itemList.map((item) => {
              return (
                <SelectItem key={item} value={String(item).toLowerCase()}>
                  {typeof item === 'string'
                    ? capitalizeFirstLetter(item)
                    : item}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
export default FormSelect;
