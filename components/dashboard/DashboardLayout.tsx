import AppSidebar from '@/components/dashboard/AppSidebar';
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='mt-4 md:mt-8 w-full'>
        <div className='mb-4  md:mb-8 flex items-center md:gap-x-8'>
          <SidebarTrigger />
          <div className='mx-auto md:ml-0'>
            <DashboardBreadcrumb />
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
export default DashboardLayout;
