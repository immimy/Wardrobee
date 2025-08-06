import MenuContainer from '@/components/dashboard/MenuContainer';
import { dashboardLinks } from '@/utils/links';

function AdminDashboardPage() {
  return (
    <section>
      <MenuContainer links={dashboardLinks.adminLinks} />
    </section>
  );
}
export default AdminDashboardPage;
