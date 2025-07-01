import AppSidebar from '@/components/dashboard/AppSidebar';
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';

async function layout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <main className='mt-4 md:mt-8 w-full'>
        <div className='flex items-center gap-x-2'>
          <SidebarTrigger />
          <DashboardBreadcrumb />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
export default layout;
