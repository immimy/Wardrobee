import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '../ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '../ui/sidebar';
import { dashboardLinks } from '@/utils/links';
import { ChevronDown } from 'lucide-react';
import { MdSpaceDashboard } from 'react-icons/md';
import { FaUserLock } from 'react-icons/fa6';
import Link from 'next/link';
import { getRole } from '@/utils/clerk';

async function AppSidebar() {
  const role = (await getRole()) || 'user';
  const adminRoles = ['admin', 'moderator'];
  const isAuthorized = adminRoles.includes(role);

  return (
    <Sidebar className='z-50'>
      <SidebarContent>
        {Object.entries(dashboardLinks).map(([key, values]) => {
          let headerLink: string = '';
          let headerTitle: string = '';
          let headerIcon: React.ReactNode | undefined;
          if (key.includes('user')) {
            headerLink = '/dashboard';
            headerTitle = 'dashboard';
            headerIcon = <MdSpaceDashboard />;
          }
          if (key.includes('admin')) {
            // Rendering only when user is an admin or moderator.
            if (!isAuthorized) return null;
            headerLink = '/admin';
            headerTitle = 'admin';
            headerIcon = <FaUserLock />;
          }
          return (
            <Collapsible key={key} defaultOpen className='group/collapsible'>
              <SidebarGroup>
                <SidebarGroupLabel
                  asChild
                  className='capitalize bg-sidebar-primary text-sidebar-primary-foreground'
                >
                  <CollapsibleTrigger>
                    <Link href={headerLink}>
                      <div className='flex items-center gap-x-4 text-sm tracking-widest font-bold'>
                        <span className='text-xl'>{headerIcon}</span>
                        {headerTitle}
                      </div>
                    </Link>
                    <ChevronDown className='ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180' />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className='text-sidebar-foreground pt-4'>
                    <SidebarMenu>
                      {values.map((item) => {
                        const { url, title } = item;
                        const Icon = item.icon!;
                        return (
                          <SidebarMenuItem key={title}>
                            <SidebarMenuButton
                              asChild
                              className='hover:text-sidebar-primary transition-colors'
                            >
                              <Link href={url}>
                                <div className='ml-4 flex items-center gap-x-4 capitalize tracking-wider font-medium '>
                                  <span className='text-lg'>
                                    <Icon />
                                  </span>
                                  <span>{title}</span>
                                </div>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
}
export default AppSidebar;
