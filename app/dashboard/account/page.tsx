import Title from '@/components/global/Title';
import DeleteUserButton from '@/components/account/DeleteUserButton';
import AvatarContainer from '@/components/account/AvatarContainer';
import UsernameContainer from '@/components/account/UsernameContainer';

function AccountPage() {
  return (
    <div className='px-4'>
      <Title title='Edit account' className='text-center' />
      <div className='mt-6'>
        <AvatarContainer />
        <UsernameContainer />
        <DeleteUserButton />
      </div>
    </div>
  );
}
export default AccountPage;
