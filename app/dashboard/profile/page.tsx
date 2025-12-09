import AddressContainer from '@/components/profile/AddressContainer';
import ProfileContainer from '@/components/profile/ProfileContainer';
import { fetchAllAddresses, getAuthUser } from '@/utils/actions';
import { unstable_cache } from 'next/cache';

async function ProfilePage() {
  const { userId } = await getAuthUser();
  const getCachedAddresses = unstable_cache(
    async () => fetchAllAddresses(userId),
    [`${userId}-all-addresses`],
    { tags: [`${userId}-all-addresses`], revalidate: 60 * 15 }
  );
  const addresses = await getCachedAddresses();
  return (
    <section className='px-4'>
      <ProfileContainer />
      <AddressContainer addresses={addresses} />
    </section>
  );
}
export default ProfilePage;
