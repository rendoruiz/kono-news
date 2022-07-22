import styled from "@emotion/styled";
import { DefaultIconStyle, primaryColor, secondaryColor, transitionFunction } from "../../styles/styledConstants";

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
  padding: 4px;
  width: 80%;
  min-width: 120px;
  max-width: 300px;
  background: ${secondaryColor};
  overflow-y: auto;
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  transition-property: transform;
  ${transitionFunction}
`;
export const NavigationPanelOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: ${({isExpanded}) => !isExpanded ? '0' : '1' };
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  transition-property: opacity;
  ${transitionFunction}
  cursor: pointer;
`;

export const NavigationList = styled.ul`
  display: grid;
  padding: 5px 0;
`;
export const NavigationItem = styled.li`
  display: flex;
  position: relative;

  label {
    flex: 1;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 5px 3px 5px 0;
    user-select: none;
    cursor: pointer;
    
    span {
      margin-left: 4px;
      line-height: 1;
    }
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:checked + label {
      background: rgba(0,0,0,0.10);
    }
    &:checked + label::before {
      content: ' ';
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: 4px;
      margin: auto 0;
      width: 3px;
      height: 50%;
      background: ${primaryColor};
      pointer-events: none;
    }
  }
`;

export const NavigationItemIcon = styled.div`
  ${DefaultIconStyle}
`