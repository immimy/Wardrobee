import Container from '../global/Container';
import HomeButton from './HomeButton';
import NavSearch from './NavSearch';
import {
  CartContainerLazyLoading,
  LinksDropdownLazyLoading,
  ToggleThemeLazyLoading,
} from './LazyLoading';
import DemoLogin from './DemoLogin';

async function Navbar() {
  return (
    <nav className='py-3 bg-primary text-primary-foreground dark:bg-muted dark:text-muted-foreground sticky top-0 z-40'>
      <Container className='flex justify-between items-center'>
        <HomeButton />
        <NavSearch />
        <div className='flex items-center gap-x-2 dark:*:bg-muted dark:*:text-muted-foreground dark:*:shadow-foreground/50'>
          <DemoLogin />
          <ToggleThemeLazyLoading />
          <CartContainerLazyLoading />
          <LinksDropdownLazyLoading />
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
