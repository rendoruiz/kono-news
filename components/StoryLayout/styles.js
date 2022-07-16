import styled from "@emotion/styled";
import { viewport } from "../../styles/globalStyles";

export const StoryLayout = styled.div`
  position: relative;
  display: grid;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  background-color: rgb(246, 246, 239);

  ${viewport.md} {
    grid-template-columns: auto 1fr;
  }
`;

export const StoryContent = styled.div`
  overflow-y: auto;
`;

export const NavigationSidebar = styled.nav`
  display: ${(props) => props.isOpen ? 'block' : 'none'};
  position: absolute;
  inset: 0 auto 0 0;
  z-index: 1000;
  width: 100%;
  max-width: 200px;
  background: aliceblue;
  overflow-y: auto;
`;

export const NavigationSidebarOverlay = styled.div`
  display: ${(props) => props.isOpen ? 'block' : 'none'};
  position: absolute;
  inset: 0;
  z-index: 100;
  background: rgba(0,0,0,0.50);
`;

export const NavigationToggle = styled.button`

`;

export const NavigationList = styled.ul`
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