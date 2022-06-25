import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <nav>
        <ul>
          <NavItem route='/'>
            News
          </NavItem>
          <NavItem route='/newest'>
            Newest
          </NavItem>
          <NavItem route='/ask'>
            Ask
          </NavItem>
          <NavItem route='/show'>
            Show
          </NavItem>
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