import AppSidebar from '@/components/dashboard/AppSidebar';
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
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
