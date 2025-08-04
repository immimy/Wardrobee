'use client';

import { useState } from 'react';
import NewVariantInput from './NewVariantForm';
import AddOptionButton from '@/components/single-variant/AddOptionButton';

function NewVariantContainer() {
  const [isCreate, setIsCreate] = useState(false);
  const handleAddOption = () => setIsCreate(true);
  return (
    <>
      {isCreate && <NewVariantInput setIsCreate={setIsCreate} />}
      <AddOptionButton onClick={handleAddOption} />
    </>
  );
}
export default NewVariantContainer;
