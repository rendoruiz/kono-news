import styled from "@emotion/styled";
import { useContext } from "react";
import { useNavigation } from "../../contexts/navigation";

import { NAVIGATION_ACTION, NAVIGATION_ITEMS } from "../../utils/constants";

//#region styles
const StyledNavigationPanel = styled.section`

`;
const StyledNavigationList = styled.ul`
  display: grid;
`;
//#endregion

const NavigationPanel = ({ isExpanded, initialStoryListModeId, onTogglePanel, }) => {
  return (
    <StyledNavigationPanel>
      <NavigationList
        initialStoryListModeId={initialStoryListModeId}
        onTogglePanel={onTogglePanel}
      />
    </StyledNavigationPanel>
  );
}

const NavigationList = ({ initialStoryListModeId }) => {
  return (
    <StyledNavigationList>
      {NAVIGATION_ITEMS.map((navigationItemData) => (
        <NavigationItem
          key={navigationItemData.label}
          navigationItemData={navigationItemData}
        />
      ))}
    </StyledNavigationList>
  )
}

const NavigationItem = ({ navigationItemData }) => {
  const dispatchNavigation = useNavigation();

  const handleClick = () => {
    dispatchNavigation({
      type: NAVIGATION_ACTION.SET_ID,
      id: navigationItemData.id,
    })
  }
  return (
    <button type='button' onClick={handleClick}>
      {navigationItemData.label}
    </button>
  )
}

export default NavigationPanel;