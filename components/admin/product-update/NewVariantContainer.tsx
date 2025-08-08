'use client';

import { useState } from 'react';
import NewVariantForm from './NewVariantForm';
import AddOptionButton from '@/components/single-variant/AddOptionButton';
import { useCategoryFormContext } from './CategoryForm';

function NewVariantContainer() {
  const { category } = useCategoryFormContext()!;
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
