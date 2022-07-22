import styled from "@emotion/styled";

/*
  === Structure ====
  > NavigationPanelOverlay
  > NavigationPanel
  -> NavigationToggle
  -> NavigationList
  --> NavigationItem
*/

export const NavigationPanel = styled.section`
  position: fixed;
  z-index: 1000;
  inset: 0 auto 0 0;
  width: 80%;
  min-width: 120px;
  max-width: 300px;
  background: rgb(246, 246, 239);
  overflow-y: auto;
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  transition: transform 200ms ease-in-out;
`;
export const NavigationPanelOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: ${({isExpanded}) => !isExpanded ? '0' : '1' };
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  transition: opacity 200ms ease-in-out;
`;

export const NavigationToggle = styled.button`
  border: none;
  padding: 10px 3px;
  cursor: pointer;
`;
export const NavigationList = styled.ul`
  display: grid;
`;
export const NavigationItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    padding: 10px 3px;
    cursor: pointer;
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  input[type="radio"]:checked + label {
    background: rgba(0,0,0,0.25);
  }
`;