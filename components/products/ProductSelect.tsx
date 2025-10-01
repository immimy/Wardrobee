import { ProductVariant } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

function ProductSelect({
  name,
  labelText,
  placeholder,
  itemList,
}: {
  name: string;
  labelText: string;
  placeholder: string;
  itemList: Array<ProductVariant>;
}) {
  return (
    <Select name={name}>
      <SelectTrigger className='w-full'>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{labelText}</SelectLabel>
          {itemList.map((item) => {
            const itemValue = item.size ?? item.color!;
            return (
              <SelectItem key={itemValue} value={item.id}>
                {itemValue}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export default ProductSelect;
