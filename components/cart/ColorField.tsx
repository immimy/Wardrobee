type ParamsType = {
  value: string;
};

function ColorField({ value }: ParamsType) {
  return (
    <div className='grid place-items-center text-sm tracking-wider'>
      <span className='mb-1 uppercase font-semibold'>Color</span>
      <div
        className='w-12 h-6 rounded shadow-2xs'
        style={{ backgroundColor: value }}
      />
    </div>
  );
}
export default ColorField;
