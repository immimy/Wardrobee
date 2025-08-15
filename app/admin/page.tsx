import MenuContainer from '@/components/dashboard/MenuContainer';
import { dashboardLinks } from '@/utils/links';

function AdminDashboardPage() {
  return (
    <section className='mb-8'>
      <MenuContainer links={dashboardLinks.adminLinks} />
    </section>
  );
}
export default AdminDashboardPage;
