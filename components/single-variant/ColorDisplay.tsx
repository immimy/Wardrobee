import { Label } from '@/components/ui/label';

type ParamsType = {
  value: string | undefined;
};

function ColorDisplay({ value }: ParamsType) {
  return (
    <div className='mb-4'>
      <Label className='mb-1 capitalize tracking-tight text-base'>color</Label>
      <div
        className='w-12 h-8 border-[0.5px] border-black/30'
        style={{ backgroundColor: value }}
      />
    </div>
  );
}
export default ColorDisplay;
