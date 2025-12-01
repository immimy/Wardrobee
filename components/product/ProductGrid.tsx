type ParamsType = { children: React.ReactNode };
function ProductGrid({ children }: ParamsType) {
  return (
    <div className='grid sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-[98%] mx-auto'>
      {children}
    </div>
  );
}
export default ProductGrid;
