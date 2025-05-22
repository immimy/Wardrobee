import SidebarToggleContainer from '@/components/dashboard/SidebarContainer';
import SidebarMenu from '@/components/dashboard/SidebarMenu';

function layout({ children }: { children: React.ReactNode }) {
  return (
    <main className='mt-8 md:grid md:grid-cols-12'>
      <div className='md:hidden flex justify-end'>
        <SidebarMenu />
      </div>
      <div className='col-span-2 hidden md:block'>
        <SidebarToggleContainer />
      </div>
      <div className='col-span-10'>{children}</div>
    </main>
  );
}
export default layout;
