type ParamsType = {
  value: string;
  grayscale?: boolean;
};

function ColorField({ value, grayscale }: ParamsType) {
  return (
    <div className='grid place-items-center text-sm tracking-wider'>
      <span className='mb-1 uppercase font-semibold'>Color</span>
      <div
        className={`w-12 h-6 rounded shadow-2xs ${
          grayscale &&
          'relative after:absolute after:rounded after:w-12 after:h-6 after:bg-gray-600/20'
        }`}
        style={{ backgroundColor: value }}
      />
    </div>
  );
}
export default ColorField;
