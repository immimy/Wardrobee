import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import DefaultAddressForm from './DefaultAddressForm';

function DefaultAddressAlert() {
  return (
    <AlertDialog>
      {/* Hidden Alert Trigger Button */}
      <AlertDialogTrigger asChild>
        <Button
          id='default-address-alert'
          variant='outline'
          className='hidden'
        />
      </AlertDialogTrigger>
      {/* Alert Content */}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Set as Default Address</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to make this address your default for future orders?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No</AlertDialogCancel>
          {/* Default Address Submit Button */}
          <DefaultAddressForm>
            <AlertDialogAction type='submit'>
              Yes, set as default
            </AlertDialogAction>
          </DefaultAddressForm>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
export default DefaultAddressAlert;
