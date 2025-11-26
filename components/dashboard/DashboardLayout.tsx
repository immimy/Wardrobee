import AppSidebar from '@/components/dashboard/AppSidebar';
import DashboardBreadcrumb from '@/components/dashboard/DashboardBreadcrumb';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import Container from '../global/Container';

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <section className='w-full'>
        {/* BREADCRUMB */}
        <div className='py-4 bg-background text-foreground sticky top-[60px] z-50'>
          <Container className='flex items-center md:gap-x-8'>
            <SidebarTrigger
              variant='default'
              className='rounded-full hover:cursor-pointer'
            />
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
