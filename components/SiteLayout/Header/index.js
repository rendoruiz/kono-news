import Link from 'next/link'

const Header = () => {
  return (
    <header>
      <h1>Hacker News</h1>
      <nav>
        <ul>
          <NavItem route='/'>
            News (Best)
          </NavItem>
          <NavItem route='/new'>
            Newest
          </NavItem>
          <NavItem route='/top'>
            Top
          </NavItem>
          <NavItem route='/ask'>
            Ask
          </NavItem>
          <NavItem route='/show'>
            Show
          </NavItem>
          <NavItem route='/jobs'>
            Jobs
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