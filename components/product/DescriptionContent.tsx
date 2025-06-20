'use client';

import { useState } from 'react';
import { MdOutlineExpandMore, MdOutlineExpandLess } from 'react-icons/md';
import { Button } from '../ui/button';

function DescriptionContent({ content }: { content?: string | null }) {
  if (!content) return null;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <p className='tracking-wide leading-8'>
        {isOpen ? content : <>{content.slice(0, 200)}...</>}
        <Button
          variant='outline'
          size='icon'
          className='rounded-full size-5 ml-3'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <MdOutlineExpandLess /> : <MdOutlineExpandMore />}
        </Button>
      </p>
    </>
  );
}
export default DescriptionContent;
