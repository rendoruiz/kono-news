import styled from "@emotion/styled";
import { viewport } from "../../styles/styledViewports";

export const MainLayout = styled.div`
  position: relative;
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  ${viewport.md} {
    grid-template-columns: auto 1fr;
  }
`;

export const NavigationSidebar = styled.nav`
  display: ${(props) => props.isOpen ? 'block' : 'none'};
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1000;
  width: 100%;
  max-width: 280px;
  background: aliceblue;
  overflow-y: auto;
  

  ${viewport.md} {

  }
`;

export const NavigationSidebarOverlay = styled.div`
  display: ${(props) => props.isOpen ? 'block' : 'none'};
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.50);
`;

export const NavList = styled.ul`
  display: grid;
  list-style-type: none;
  padding-left: 0;
  font-size: 1.15em;

  li {
    display: grid;
  }
  a {
    padding: 10px 20px;
  }
`;