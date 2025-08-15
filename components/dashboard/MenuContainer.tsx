import MenuCard from './MenuCard';
import { NavLink } from '@/utils/types';

type ParamsType = { links: Array<NavLink> };

function MenuContainer({ links }: ParamsType) {
  return (
    <div className='grid gap-6 grid-cols-auto'>
      {links.map((link) => {
        return <MenuCard key={link.url} {...link} />;
      })}
    </div>
  );
}
export default MenuContainer;
