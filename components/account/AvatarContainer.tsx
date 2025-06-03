import ImageInput from '../form/ImageInput';
import SubmitButton from '../form/SubmitButton';
import FormContainer from '../form/FormContainer';
import { FormState } from '@/utils/types';
import AvatarImage from '../global/AvatarImage';

function AvatarContainer({
  updateAvatarAction,
  deleteAvatarAction,
}: {
  updateAvatarAction: (
    prevState: any,
    formData: FormData
  ) => Promise<FormState>;
  deleteAvatarAction: () => Promise<FormState>;
}) {
  return (
    <div className='mt-6 px-4 flex justify-center items-center gap-x-6'>
      <AvatarImage height={128} width={128} className='h-32 w-32 min-w-32' />
      <div className='mb-6'>
        <FormContainer action={updateAvatarAction}>
          <ImageInput name='avatar' />
          <SubmitButton text='update avatar' className='w-full' />
        </FormContainer>
        <FormContainer action={deleteAvatarAction}>
          <SubmitButton
            text='delete avatar'
            variant='link'
            className='text-destructive w-full'
          />
        </FormContainer>
      </div>
    </div>
  );
}
export default AvatarContainer;
