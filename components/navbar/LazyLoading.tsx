'use client';
import IconButtonSkeleton from '../skeleton/IconButtonSkeleton';
// Lady load client component
// (Avoid Hydration Mismatch)
import dynamic from 'next/dynamic';
const ToggleTheme = dynamic(() => import('./ToggleTheme'), {
  ssr: false,
  loading: () => <IconButtonSkeleton />,
});
const CartContainer = dynamic(() => import('./CartContainer'), {
  ssr: false,
  loading: () => <IconButtonSkeleton />,
});
const LinksDropdown = dynamic(() => import('./LinksDropdown'), {
  ssr: false,
  loading: () => <IconButtonSkeleton />,
});

export function ToggleThemeLazyLoading() {
  return <ToggleTheme />;
}
export function CartContainerLazyLoading() {
  return <CartContainer />;
}
export function LinksDropdownLazyLoading() {
  return <LinksDropdown />;
}
