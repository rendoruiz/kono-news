import { useRouter } from "next/router";

import NavigationToggle from "../shared/NavigationToggle";

import { handleOnKeyDown } from "../../utils";
import { NAVIGATION_ITEMS, QUERY_KEY } from "../../utils/constants";
import * as Styled from "./styles";

const NavigationPanel = ({ isExpanded, initialSelectedItemId, onTogglePanel, }) => {
  return (
    <>
      <Styled.NavigationPanelOverlay 
        isExpanded={isExpanded} 
        onClick={onTogglePanel}
      />
      <Styled.NavigationPanel isExpanded={isExpanded}>
        <NavigationToggle onClick={onTogglePanel} />
        <NavigationList initialSelectedItemId={initialSelectedItemId} />
      </Styled.NavigationPanel>
    </>
  );
}

const NavigationList = ({ initialSelectedItemId }) => (
  <Styled.NavigationList>
    {NAVIGATION_ITEMS.map((navigationItemData) => (
      <NavigationItem
        key={navigationItemData.label}
        navigationItemData={navigationItemData}
        initialSelectedItem={navigationItemData.id === initialSelectedItemId ? true : undefined}
      />
    ))}
  </Styled.NavigationList>
);

const NavigationItem = ({ navigationItemData, initialSelectedItem }) => {
  const router = useRouter();
  const controlId = 'nav-item-' + navigationItemData.id;

  const handleNavigationChange = () => {
    const { 
      [QUERY_KEY.IS_NAVIGATION_EXPANDED]: isNavOpen, 
      ...newRouterQuery
    } = router.query
    router.replace(
      { query: { 
        ...newRouterQuery,
        [QUERY_KEY.STORY_MODE]: navigationItemData.id, 
      }}, 
      undefined, 
      { shallow: true }
    );
  }
  
  return (
    <Styled.NavigationItem>
      <input 
        type="radio" 
        name='navigation-item' 
        id={controlId} 
        onKeyDown={(e) => handleOnKeyDown(e, handleNavigationChange)} 
        defaultChecked={initialSelectedItem}
      />
      <label 
        htmlFor={controlId} 
        onClick={() => handleNavigationChange()}
      >
        {navigationItemData.label}
      </label>
    </Styled.NavigationItem>
  )
}

export default NavigationPanel;