import Link from 'next/link'
import { useState } from 'react';

import * as Styled from './styles';
import { ListMode } from '../../utils/hnStories';

const MainLayout = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const handleNavToggle = () => setIsNavOpen(!isNavOpen);
  return (  
    <Styled.MainLayout>
      <NavigationSidebar isOpen={isNavOpen} onToggle={handleNavToggle} />
      <div>
        <header>
        <button type='button' onClick={handleNavToggle}>
          toggle
        </button>
        </header>
        <main>
          {children}
        </main>
      </div>
    </Styled.MainLayout>
  );
}

const NavigationSidebar = ({ isOpen, onToggle }) => (
  <>
    <Styled.NavigationSidebarOverlay 
      isOpen={isOpen} 
      onClick={onToggle} 
    />

    <Styled.NavigationSidebar isOpen={isOpen}>
      <button type='button' onClick={onToggle}>
        toggle
      </button>
      <h1>Hacker News</h1>
      <NavList onClick={onToggle} />
    </Styled.NavigationSidebar>
  </>
);

const NavList = ({ onClick }) => (
  <Styled.NavList>
    {Object.keys(ListMode).map((mode) => (
      <NavItem 
        key={mode} 
        route={{ query: `mode=${mode.toLowerCase()}` }}
        onClick={onClick}
      >
        {ListMode[mode].label}
      </NavItem>
    ))}
  </Styled.NavList>
);

const NavItem = ({ 
  route, 
  children, 
  ...props
}) => (
  <li>
    <Link href={route}>
      <a {...props}>{children}</a>
    </Link>
  </li>
)
 
export default MainLayout;