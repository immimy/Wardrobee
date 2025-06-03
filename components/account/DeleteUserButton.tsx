import { FormState } from '@/utils/types';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';

function DeleteUserButton({
  deleteUserAction,
}: {
  deleteUserAction: () => Promise<FormState>;
}) {
  return (
    <FormContainer action={deleteUserAction}>
      <div className='p-4 mx-auto max-w-96'>
        <SubmitButton
          text='delete account'
          variant='destructive'
          className='uppercase font-medium tracking-wide w-full'
        />
      </div>
    </FormContainer>
  );
}
export default DeleteUserButton;
