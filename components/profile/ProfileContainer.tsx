import Title from '../global/Title';
import AvatarImage from '../global/AvatarImage';
import { currentUser } from '@clerk/nextjs/server';

async function AccountContainer() {
  const user = await currentUser();
  return (
    <>
      <Title title='profile' />
      <div className='p-4 flex flex-col items-center'>
        <AvatarImage height={128} width={128} className='h-32 w-32' />
        <div className='mt-4 flex items-center gap-x-4'>
          <h6 className='capitalize font-medium'>username :</h6>
          <p>{user?.username || '-'}</p>
        </div>
      </div>
    </>
  );
}
export default AccountContainer;
