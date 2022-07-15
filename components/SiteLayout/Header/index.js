import Link from 'next/link'
import { ListMode } from '../../../utils/hnStories';

const Header = () => {
  return (
    <header>
      <h1>Hacker News</h1>
      <nav>
        <ul>
          {Object.keys(ListMode).map((mode) => (
            <NavItem route={{ query: `mode=${mode.toLowerCase()}` }}>
              {ListMode[mode].label}
            </NavItem>
          ))}
        </ul>
      </nav>
    </header>
  );
}

const NavItem = ({ 
  route, 
  children, 
}) => (
  <li>
    <Link href={route}>
      <a>{children}</a>
    </Link>
  </li>
)
 
export default Header;