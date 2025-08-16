import MenuContainer from '@/components/dashboard/MenuContainer';
import { dashboardLinks } from '@/utils/links';

function AdminDashboardPage() {
  return <MenuContainer links={dashboardLinks.adminLinks} />;
}
export default AdminDashboardPage;
