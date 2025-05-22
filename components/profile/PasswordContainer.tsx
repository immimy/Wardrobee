import { changePasswordAction } from '@/utils/actions';
import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import Title from '../global/Title';
import SubmitButton from '../form/SubmitButton';

function PasswordContainer() {
  return (
    <div className='p-4'>
      <Title title='change password' className='text-center' />
      <div className='max-w-sm px-4 mt-8 mx-auto'>
        <FormContainer action={changePasswordAction}>
          <FormInput
            type='password'
            labelText='current password'
            name='currentPassword'
          />
          <FormInput
            type='password'
            labelText='new password'
            name='newPassword'
          />
          <SubmitButton />
        </FormContainer>
      </div>
    </div>
  );
}
export default PasswordContainer;
