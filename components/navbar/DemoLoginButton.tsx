'use client';

import { demoLogin } from '@/utils/actions';
import { Button } from '../ui/button';

type ParamsType = { role: 'user' | 'moderator' };
function DemoLoginButton({ role }: ParamsType) {
  return (
    <Button
      type='button'
      variant='ghost'
      size='sm'
      onClick={() => demoLogin(role)}
      className='w-full hover:cursor-pointer capitalize font-medium tracking-wider text-chart-4'
    >
      {role}
    </Button>
  );
}
export default DemoLoginButton;
