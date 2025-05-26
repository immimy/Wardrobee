import Title from '../global/Title';
import AvatarImage from '../global/AvatarImage';
import { getAuthUser } from '@/utils/actions';
import DeleteUserButton from './DeleteUserButton';

async function AccountContainer() {
  const user = await getAuthUser();

  return (
    <div className='p-4'>
      {/* Account */}
      <Title title='account' className='text-center' />
      <div className='p-4 flex flex-col items-center'>
        <AvatarImage height={128} width={128} className='h-32 w-32' />
        <div className='mt-4 flex items-center gap-x-4'>
          <h6 className='capitalize font-medium'>username :</h6>
          <p>{user?.username || '-'}</p>
        </div>
        <div className='mt-6'>
          <DeleteUserButton />
        </div>
      </div>
      {/* Address */}
      <Title title='address' />
    </div>
  );
}
export default AccountContainer;
