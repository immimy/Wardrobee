import Container from '../global/Container';
import HomeButton from './HomeButton';
import NavSearch from './NavSearch';
import ToggleTheme from './ToggleTheme';
import CartButton from './CartButton';
import LinksDropdown from './LinksDropdown';

function Navbar() {
  return (
    <nav className='py-3 bg-primary'>
      <Container className='flex justify-between items-center'>
        <HomeButton />
        <NavSearch />
        <div className='flex items-center gap-x-2'>
          <ToggleTheme />
          <CartButton />
          <LinksDropdown />
        </div>
      </Container>
    </nav>
  );
}
export default Navbar;
