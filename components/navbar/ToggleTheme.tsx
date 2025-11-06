'use client';

import { IoSunny, IoMoon } from 'react-icons/io5';
import { Button } from '../ui/button';
import { useTheme } from 'next-themes';
import { isDarkTheme } from '@/utils/clientFunctions';

function ToggleTheme() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = isDarkTheme(resolvedTheme);

  return (
    <Button
      variant='default'
      size='icon'
      className='rounded-full hover:cursor-pointer'
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span>{isDark ? <IoSunny /> : <IoMoon />}</span>
    </Button>
  );
}
export default ToggleTheme;
