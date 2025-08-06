import { NavLink } from '@/utils/types';
import Link from 'next/link';

function MenuCard({ url, title, icon }: NavLink) {
  const Icon = icon!;
  return (
    <Link href={url}>
      <div className='mb-6 sm:mb-0 py-8 border drop-shadow-xl shadow-accent bg-primary/30 text-primary-foreground rounded-2xl hover:bg-secondary hover:text-secondary-foreground grid place-items-center'>
        <Icon className='mb-4 text-9xl' />
        <h6 className='capitalize text-center text-xl font-bold tracking-widest'>
          {title}
        </h6>
      </div>
    </Link>
  );
}
export default MenuCard;
