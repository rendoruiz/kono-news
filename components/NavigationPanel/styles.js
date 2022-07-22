import styled from "@emotion/styled";
import { DefaultIconStyle, transitionFunction } from "../../styles/styledConstants";

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
  ${transitionFunction('transform')}
`;
export const NavigationPanelOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: ${({isExpanded}) => !isExpanded ? '0' : '1' };
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  ${transitionFunction('opacity')}
  cursor: pointer;
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
    display: flex;
    align-items: center;
    padding: 5px 3px;
    user-select: none;
    cursor: pointer;
    
    span {
      margin-left: 6px;
    line-height: 1;
    }
  }

  input[type="radio"] {
    position: absolute;
    opacity: 0;
    pointer-events: none;

    &:checked + label {
      background: rgba(0,0,0,0.25);
    }
  }
`;

export const NavigationItemIcon = styled.div`
  ${DefaultIconStyle}
`