import Title from '../global/Title';
import AvatarImage from '../global/AvatarImage';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';
import { getAuthUser, deleteUserAction } from '@/utils/actions';

async function ProfileContainer() {
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
          <FormContainer action={deleteUserAction}>
            <SubmitButton
              text='delete account'
              variant='destructive'
              className='uppercase font-medium tracking-wide'
            />
          </FormContainer>
        </div>
      </div>
      {/* Address */}
      <Title title='address' />
    </div>
  );
}
export default ProfileContainer;
