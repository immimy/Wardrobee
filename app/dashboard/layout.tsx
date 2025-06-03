import SidebarToggleContainer from '@/components/dashboard/SidebarContainer';
import SidebarMenu from '@/components/dashboard/SidebarMenu';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='md:grid md:grid-cols-12'>
      <div className='md:hidden flex justify-end mt-4'>
        <SidebarMenu />
      </div>
      <div className='hidden md:block col-span-2'>
        <SidebarToggleContainer />
      </div>
      <div className='col-span-10 md:px-4'>{children}</div>
    </main>
  );
}
export default layout;
