'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { navItems } from '@/config/nav-config';
import { useFilteredNavItems } from '@/hooks/use-nav';
import { useUser } from '@/hooks/use-user';
import { useAuth } from '@/hooks/use-auth';
import {
  IconChevronRight,
  IconChevronsDown,
  IconCreditCard,
  IconLogout,
  IconUserCircle
} from '@tabler/icons-react';

import { Icons } from '../icons';
import { OrgSwitcher } from '../org-switcher';

function isRouteActive(pathname: string, url: string) {
  if (pathname === url) return true;
  if (url === '/') return false;
  return pathname.startsWith(`${url}/`);
}

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useUser();
  const { logout } = useAuth();
  const { setOpenMobile } = useSidebar();

  const filteredItems = useFilteredNavItems(navItems);

  const closeMobileSidebar = React.useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  React.useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  const handleNavigate = React.useCallback(
    (href: string) => {
      closeMobileSidebar();
      router.push(href);
    },
    [closeMobileSidebar, router]
  );

  const handleLogout = React.useCallback(async () => {
    closeMobileSidebar();
    await logout();
  }, [closeMobileSidebar, logout]);

  const navButtonClass = (active: boolean) =>
    cn(
      'font-medium text-sm leading-none tracking-tight transition-colors',
      active && 'font-semibold'
    );

  const subNavButtonClass = (active: boolean) =>
    cn(
      'font-medium text-sm leading-none tracking-tight transition-colors',
      active && 'font-semibold'
    );

  return (
    <Sidebar
      collapsible='icon'
      className='transition-all duration-200 ease-out'
    >
      <SidebarHeader>
        <OrgSwitcher />
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>

          <SidebarMenu>
            {filteredItems.map((item) => {
              const Icon = item.icon ? Icons[item.icon] : Icons.logo;
              const active = isRouteActive(pathname, item.url);

              if (item.items?.length) {
                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={item.isActive ?? active}
                    className='group/collapsible'
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={active}
                          className={navButtonClass(active)}
                        >
                          {item.icon && <Icon />}
                          <span>{item.title}</span>
                          <IconChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => {
                            const subActive = isRouteActive(
                              pathname,
                              subItem.url
                            );

                            return (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={subActive}
                                  className={subNavButtonClass(subActive)}
                                >
                                  <Link
                                    href={subItem.url}
                                    onClick={closeMobileSidebar}
                                    className='text-sm leading-none font-medium tracking-tight transition-colors'
                                  >
                                    <span>{subItem.title}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              }

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={active}
                    className={navButtonClass(active)}
                  >
                    <Link
                      href={item.url}
                      onClick={closeMobileSidebar}
                      className='flex w-full items-center gap-2 text-sm leading-none font-medium tracking-tight transition-colors'
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {user && (
                    <UserAvatarProfile
                      className='h-8 w-8 rounded-lg'
                      showInfo
                      user={user}
                    />
                  )}
                  <IconChevronsDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className='w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='px-1 py-1.5'>
                    {user && (
                      <UserAvatarProfile
                        className='h-8 w-8 rounded-lg'
                        showInfo
                        user={user}
                      />
                    )}
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onSelect={() => handleNavigate('/dashboard/profile')}
                  >
                    <IconUserCircle className='mr-2 h-4 w-4' />
                    Profile
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onSelect={() => handleNavigate('/dashboard/billing')}
                  >
                    <IconCreditCard className='mr-2 h-4 w-4' />
                    Billing
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => void handleLogout()}>
                  <IconLogout className='mr-2 h-4 w-4' />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
