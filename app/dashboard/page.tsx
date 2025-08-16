import MenuContainer from '@/components/dashboard/MenuContainer';
import { dashboardLinks } from '@/utils/links';

function DashboardPage() {
  return <MenuContainer links={dashboardLinks.userLinks} />;
}
export default DashboardPage;
