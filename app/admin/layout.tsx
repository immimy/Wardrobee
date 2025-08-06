import DashboardLayout from '@/components/dashboard/DashboardLayout';

async function layout({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
export default layout;
