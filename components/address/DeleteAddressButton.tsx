import { deleteAddress } from '@/utils/actions';
import { FaTrashCan } from 'react-icons/fa6';
import FormContainer from '../form/FormContainer';
import SubmitButton from '../form/SubmitButton';

type ParamsType = { id: string };

function DeleteAddressButton({ id }: ParamsType) {
  const deleteAddressAction = deleteAddress.bind(null, id);
  return (
    <FormContainer action={deleteAddressAction}>
      <SubmitButton variant='ghost' size='icon' icon={<FaTrashCan />} />
    </FormContainer>
  );
}
export default DeleteAddressButton;
