import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

function FormSelect({
  name,
  labelText,
  placeholder,
  itemList,
}: {
  name: string;
  labelText: string;
  placeholder: string;
  itemList: Array<string | number>;
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
            return (
              <SelectItem key={item} value={String(item)}>
                {item}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
export default FormSelect;
