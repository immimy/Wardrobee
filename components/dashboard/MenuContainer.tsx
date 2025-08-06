import MenuCard from './MenuCard';
import { NavLink } from '@/utils/types';

type ParamsType = { links: Array<NavLink> };

function MenuContainer({ links }: ParamsType) {
  return (
    <div className='sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
      {links.map((link) => {
        return <MenuCard key={link.url} {...link} />;
      })}
    </div>
  );
}
export default MenuContainer;
