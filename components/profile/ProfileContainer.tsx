'use client';

import Title from '../global/Title';
import AvatarImage from '../global/AvatarImage';
import { useAppSelector } from '@/lib/hooks';

function AccountContainer() {
  const { username } = useAppSelector((store) => store.user);
  return (
    <>
      <Title title='profile' />
      <div className='p-4 flex flex-col items-center'>
        <AvatarImage height={128} width={128} className='h-32 w-32' />
        <div className='mt-4 flex items-center gap-x-4'>
          <h6 className='capitalize font-medium'>username :</h6>
          <p>{username || '-'}</p>
        </div>
      </div>
    </>
  );
}
export default AccountContainer;
