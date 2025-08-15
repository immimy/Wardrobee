import MenuContainer from '@/components/dashboard/MenuContainer';
import { dashboardLinks } from '@/utils/links';

function DashboardPage() {
  return (
    <section className='mb-8'>
      <MenuContainer links={dashboardLinks.userLinks} />
    </section>
  );
}
export default DashboardPage;
