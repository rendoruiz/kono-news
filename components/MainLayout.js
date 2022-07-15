import Link from 'next/link'
import styled from "@emotion/styled";
import { ListMode } from '../utils/hnStories';

const StyledSiteLayout = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
`;

const MainLayout = ({ children }) => {
  return (  
    <StyledSiteLayout>
      <Header />
        <main>{children}</main>
      <Footer />
    </StyledSiteLayout>
  );
}

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
 
const Footer = () => (
  <footer>
    Footer
  </footer>
);
 
export default MainLayout;