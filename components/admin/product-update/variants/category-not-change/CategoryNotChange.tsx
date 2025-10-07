'use client';

import SingleVariantContainer from './SingleVariantContainer';
import NewVariantContainer from './NewVariantContainer';
import { useProductUpdateContext } from '../../ProductProvider';

function VariantsContainer() {
  const { product, category } = useProductUpdateContext();
  if (category !== product.category) return null;
  return (
    <>
      <SingleVariantContainer />
      <NewVariantContainer />
    </>
  );
}
export default VariantsContainer;
