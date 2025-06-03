import FormContainer from '../form/FormContainer';
import FormInput from '../form/FormInput';
import SubmitButton from '../form/SubmitButton';
import { updateProfileAction } from '@/utils/actions';

function UsernameContainer() {
  return (
    <FormContainer action={updateProfileAction}>
      <div className='p-4 mx-auto max-w-96'>
        <FormInput type='text' name='username' placeholder='username' />
        <SubmitButton className='w-full' />
      </div>
    </FormContainer>
  );
}
export default UsernameContainer;
