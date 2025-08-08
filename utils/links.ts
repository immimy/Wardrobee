import { NavLink } from './types';
import { FaUser, FaGear } from 'react-icons/fa6';
import { PiShoppingBagLight } from 'react-icons/pi';
import { TbShoppingBagEdit, TbShoppingBagPlus } from 'react-icons/tb';
import { IoMdHeart } from 'react-icons/io';

export const links: Array<NavLink> = [
  { url: '/promotion', title: 'promotion' },
  { url: '/products', title: 'products' },
  { url: '/dashboard', title: 'dashboard' },
  { url: '/admin', title: 'admin' },
];

const userLinks: Array<NavLink> = [
  { url: '/dashboard/profile', title: 'profile', icon: FaUser },
  { url: '/dashboard/orders', title: 'my orders', icon: PiShoppingBagLight },
  { url: '/dashboard/favorite', title: 'favorite', icon: IoMdHeart },
  { url: '/dashboard/account', title: 'account', icon: FaGear },
];
const adminLinks: Array<NavLink> = [
  {
    url: '/admin/products',
    title: 'products',
    icon: TbShoppingBagEdit,
  },
  {
    url: '/admin/product-create',
    title: 'create product',
    icon: TbShoppingBagPlus,
  },
];
export const dashboardLinks = { userLinks, adminLinks };
