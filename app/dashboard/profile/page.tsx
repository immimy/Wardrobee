import AddressContainer from '@/components/profile/AddressContainer';
import ProfileContainer from '@/components/profile/ProfileContainer';
import { fetchAllAddresses } from '@/utils/actions';

async function ProfilePage() {
  const addresses = await fetchAllAddresses();
  return (
    <section className='px-4'>
      <ProfileContainer />
      <AddressContainer addresses={addresses} />
    </section>
  );
}
export default ProfilePage;
