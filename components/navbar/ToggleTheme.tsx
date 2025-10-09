'use client';

import { IoSunny, IoMoon } from 'react-icons/io5';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { isDarkTheme } from '@/utils/clientFunctions';
import { Themes } from '@/utils/types';

function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant='default'
      size='icon'
      className='rounded-full hover:cursor-pointer'
      onClick={() =>
        setTheme(isDarkTheme(resolvedTheme as Themes) ? 'light' : 'dark')
      }
    >
      {isDarkTheme(resolvedTheme as Themes) ? <IoSunny /> : <IoMoon />}
    </Button>
  );
}
export default ToggleTheme;
