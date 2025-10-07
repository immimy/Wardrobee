'use client';

import { useState } from 'react';
import NewVariantForm from './NewVariantForm';
import AddOptionButton from '@/components/single-variant/AddOptionButton';
import { useProductUpdateContext } from '@/components/admin/product-update/ProductProvider';

function NewVariantContainer() {
  const { category } = useProductUpdateContext();
  const [isCreate, setIsCreate] = useState(false);
  const handleAddOption = () => setIsCreate(true);
  return (
    <>
      {isCreate && <NewVariantForm setIsCreate={setIsCreate} />}
      {category !== 'accessory' && (
        <AddOptionButton onClick={handleAddOption} />
      )}
    </>
  );
}
export default NewVariantContainer;
