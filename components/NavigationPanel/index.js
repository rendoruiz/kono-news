import styled from "@emotion/styled";
import { useRouter } from "next/router";
import { handleOnKeyDown } from "../../utils";
import { NAVIGATION_ITEMS, QUERY_KEY } from "../../utils/constants";

//#region styles
const StyledNavigationPanel = styled.section`
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
const StyledNavigationPanelOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  inset: 0;
  background: rgba(0,0,0,0.5);
  opacity: ${({isExpanded}) => !isExpanded ? '0' : '1' };
  transform: translateX(${({isExpanded}) => !isExpanded ? '-110%' : '0'});
  transition: opacity 200ms ease-in-out;
`;

const StyledNavigationToggle = styled.button`
  border: none;
  padding: 10px 3px;
  cursor: pointer;
`;
const StyledNavigationList = styled.ul`
  display: grid;
`;
const StyledNavigationItem = styled.li`
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
//#endregion

const NavigationPanel = ({ isExpanded, initialSelectedItemId, onTogglePanel, }) => {
  return (
    <>
      <StyledNavigationPanelOverlay 
        isExpanded={isExpanded} 
        onClick={onTogglePanel}
      />
      <StyledNavigationPanel isExpanded={isExpanded}>
        <NavigationToggle 
          isExpanded={isExpanded} 
          onTogglePanel={onTogglePanel} 
        />
        <NavigationList initialSelectedItemId={initialSelectedItemId} />
      </StyledNavigationPanel>
    </>
  );
}

const NavigationToggle = ({ isExpanded, onTogglePanel }) => (
  <StyledNavigationToggle 
    type='button'
    isExpanded={isExpanded}
    onClick={onTogglePanel}
  >
    toggle {isExpanded ? 'Expanded' : 'Retracted'}
  </StyledNavigationToggle>
);

const NavigationList = ({ initialSelectedItemId }) => (
  <StyledNavigationList>
    {NAVIGATION_ITEMS.map((navigationItemData) => (
      <NavigationItem
        key={navigationItemData.label}
        navigationItemData={navigationItemData}
        initialSelectedItem={navigationItemData.id === initialSelectedItemId ? true : undefined}
      />
    ))}
  </StyledNavigationList>
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
    <StyledNavigationItem>
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
    </StyledNavigationItem>
  )
}

export default NavigationPanel;