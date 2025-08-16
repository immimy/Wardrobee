import AppSidebar from '@/components/dashboard/AppSidebar';
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { cookies } from 'next/headers';
import Container from '../global/Container';

async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <section className='w-full'>
        {/* BREADCRUMB */}
        <div className='py-4 bg-background text-foreground sticky top-[60px] z-50'>
          <Container className='flex items-center md:gap-x-8'>
            <SidebarTrigger variant='default' className='rounded-full' />
            <div className='mx-auto md:ml-0'>
              <DashboardBreadcrumb />
            </div>
          </Container>
        </div>
        {/* CONTENT */}
        <Container className='pb-16'>{children}</Container>
      </section>
    </SidebarProvider>
  );
}
export default DashboardLayout;
