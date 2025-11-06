import { deleteAddressAction } from '@/utils/actions';
import { FaTrashCan } from 'react-icons/fa6';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';

type ParamsType = { id: string };

function DeleteAddressButton({ id }: ParamsType) {
  const deleteAddressBind = deleteAddressAction.bind(null, id);
  return (
    <FormContainer action={deleteAddressBind}>
      <SubmitButton variant='ghost' size='icon' icon={<FaTrashCan />} />
    </FormContainer>
  );
}
export default DeleteAddressButton;
