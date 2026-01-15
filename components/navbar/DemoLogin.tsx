'use client';

import { SignedOut } from '@clerk/nextjs';
import CustomTooltip from '../global/CustomTooltip';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import DemoLoginButton from './DemoLoginButton';

function DemoLogin() {
  return (
    <SignedOut>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            size='sm'
            variant='secondary'
            className='uppercase font-semibold tracking-tight hover:cursor-pointer bg-chart-5 hover:bg-chart-5 text-shadow-chart-5 dark:bg-chart-4/80! dark:text-white/90!'
          >
            demo login
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* User Login */}
          <CustomTooltip text='User can only read products.'>
            <DropdownMenuItem className='p-0'>
              <DemoLoginButton role='user' />
            </DropdownMenuItem>
          </CustomTooltip>
          {/* Moderator Login */}
          <CustomTooltip text='Moderator can create/update/delete products.'>
            <DropdownMenuItem className='p-0'>
              <DemoLoginButton role='moderator' />
            </DropdownMenuItem>
          </CustomTooltip>
        </DropdownMenuContent>
      </DropdownMenu>
    </SignedOut>
  );
}
export default DemoLogin;
