import styled from "@emotion/styled";

import { NAVIGATION_ITEMS } from "../../utils/constants";

//#region styles
const StyledNavigationPanel = styled.section`

`;
const StyledNavigationList = styled.ul`
  display: grid;
`;
//#endregion

const NavigationPanel = ({ isOpen, storyListModeId, onListModeChange, onTogglePanel, }) => {
  return (
    <StyledNavigationPanel>
      <NavigationList
        storyListModeId={storyListModeId}
        onListModeChange={onListModeChange}
        onTogglePanel={onTogglePanel}
      />
    </StyledNavigationPanel>
  );
}

const NavigationList = ({ storyListModeId, onListModeChange, onTogglePanel }) => {
  return (
    <StyledNavigationList>
      {NAVIGATION_ITEMS.map((storyMode) => (
        <NavigationItem
          key={storyMode.label}
          storyMode={storyMode}
          onListModeChange={onListModeChange}
          onTogglePanel={onTogglePanel}
        />
      ))}
    </StyledNavigationList>
  )
}

const NavigationItem = ({ storyMode, onListModeChange, onTogglePanel }) => {
  return (
    <button type='button' onClick={() => onListModeChange(storyMode.id)}>
      {storyMode.label}
    </button>
  )
}

export default NavigationPanel;