import EditAccountContainer from '@/components/profile/EditAccountContainer';
import PasswordContainer from '@/components/profile/PasswordContainer';
import AccountContainer from '@/components/profile/AccountContainer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function ProfilePage() {
  return (
    <section>
      <Tabs defaultValue='account'>
        <TabsList className='w-full'>
          <TabsTrigger value='account' className='px-4 capitalize'>
            account
          </TabsTrigger>
          <TabsTrigger value='edit account' className='px-4 capitalize'>
            edit account
          </TabsTrigger>
          <TabsTrigger value='change password' className='px-4 capitalize'>
            change password
          </TabsTrigger>
        </TabsList>
        <TabsContent value='account'>
          <AccountContainer />
        </TabsContent>
        <TabsContent value='edit account'>
          <EditAccountContainer />
        </TabsContent>
        <TabsContent value='change password'>
          <PasswordContainer />
        </TabsContent>
      </Tabs>
    </section>
  );
}
export default ProfilePage;
